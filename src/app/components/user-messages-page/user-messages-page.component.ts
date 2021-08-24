import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PlainObject } from 'src/app/interfaces/plain-object.interface';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-user-messages-page',
  templateUrl: './user-messages-page.component.html',
  styleUrls: ['./user-messages-page.component.scss']
})
export class UserMessagesPageComponent implements OnInit {
  you;
  user;
  currentParams: Params;
  currentMessagingSelected = null;
  loading = false;

  messagings_list: any[] = [];
  messages_list: any[] = [];
  messagings_list_end = true;
  messages_list_end = true;
  userIsTyping = false;

  MSG_MAX_LENGTH = 1000;
  messageForm = new FormGroup({
    body: new FormControl('', [Validators.pattern(/[^\s]+/gi), Validators.maxLength(this.MSG_MAX_LENGTH)])
  });

  socketTypingEmitter;
  socketTypingStoppedEmitter;
  typingTimeout;

  constructor(
    private userStore: UserStoreService,
    private apiService: ApiService,
    private alertService: AlertService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
      this.getMessagings();
    });

    this.route.parent.params.subscribe((params) => {
      this.currentParams = params;
    });
  }

  ngOnDestroy() {
  }

  getMessagings() {
    const min_timestamp =
      this.messagings_list.length &&
      this.messagings_list[0].updated_at;
    this.apiService.get_user_messagings(this.you.id).subscribe({
      next: (response) => {
        for (const messaging of response.messagings) {
          this.messagings_list.unshift(messaging);
        }
        // this.messagings_list_end = response.data.length < 5;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  setMessaging(messaging) {
    if (messaging === this.currentMessagingSelected) {
      return;
    }
    this.messages_list_end = true;
    this.messages_list = [];

    let other_user = !this.currentMessagingSelected
      ? null
      : this.currentMessagingSelected.other;

    this.currentMessagingSelected = messaging;
    other_user = this.currentMessagingSelected.other;
    this.getMessages();
  }

  getMessages() {
    const min_id =
      this.messages_list.length &&
      this.messages_list[0].id;
    const other_user = this.currentMessagingSelected.other;
    this.apiService.get_user_messages_with_other_user(
      this.you.id,
      other_user.id
    ).subscribe({
      next: (response) => {
        let read_count = 0;
        for (const message of response.messages) {
          this.messages_list.unshift(message);
          const isUnreadForYou = (
            message.to_id === this.you.id &&
            message.opened === false
          );
          if (isUnreadForYou) {
            read_count++;
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  sendMessage() {
    if (this.loading) {
      return;
    }
    if (!this.messageForm.value.body.trim()) {
      return window.alert(`Message form cannot be empty`);
    }

    const other_user = this.currentMessagingSelected.other;

    this.loading = true;
    this.apiService.send_user_message(
      this.you.id,
      other_user.id,
      this.messageForm.value
    ).subscribe({
      next: (response) => {
        this.messages_list.push(response.data);
        this.messageForm.setValue({ body: '' });
        this.messageForm.get('body').markAsPristine();
        this.loading = false;
        if (this.typingTimeout) {
          clearTimeout(this.typingTimeout);
        }
        this.typingTimeout = null;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}