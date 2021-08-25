import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlainObject } from 'src/app/interfaces/plain-object.interface';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  you: PlainObject;
  @Input() user: PlainObject;
  loading = false;
  isFollowing = false;
  isConnected = false;
  connectionRequest: any;
  followers = [];
  followings = [];
  messageFormIsOpen = false;
  MSG_MAX_LENGTH = 1000;
  messageForm = new FormGroup({
    body: new FormControl('', [Validators.required, Validators.pattern(/[^\s]+/gi), Validators.maxLength(this.MSG_MAX_LENGTH)])
  });

  get isYou(): boolean {
    const isYours = (
      this.you && 
      this.user &&
      this.user.id === this.you.id
    );
    return !!isYours;
  };
  get isNotYou(): boolean {
    const notYou = (
      this.you && 
      this.user &&
      this.user.id !== this.you.id
    );
    return notYou;
  };

  constructor(
    private userStore: UserStoreService,
    private apiService: ApiService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
      
      if (this.isNotYou) {
        this.apiService.check_user_follows(
          this.you.id,
          this.user.id
        ).subscribe({
          next: (response) => {
            this.isFollowing = !!response.following;
          }
        });
      }
    });

    const followersObs = this.apiService.get_user_followers(this.user.id).pipe(
      map((response) => {
        this.followers = response.followers;
      })
    );
    const followingsObs = this.apiService.get_user_followings(this.user.id).pipe(
      map((response) => {
        this.followings = response.followings;
      })
    );

    forkJoin([followersObs, followingsObs]).subscribe({
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  toggleShowMessageForm() {
    this.messageFormIsOpen = !this.messageFormIsOpen;
  }

  ngOnChanges(changes) {
    this.messageFormIsOpen = false;
  }

  toggleFollow() {
    this.apiService.toggle_user_follow(
      this.you.id,
      this.user.id
    ).subscribe({
      next: (response) => {
        if (response.following) {
          this.followers.push(response.following);
          this.isFollowing = true;
        } else {
          const index = this.followings.findIndex(f => f.user.id === this.you.id && f.follows.id == this.user.id);
          this.followers.splice(index, 1);
          this.isFollowing = false;
        }
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

    this.loading = true;
    this.apiService.send_user_message(
      this.you.id,
      this.user.id,
      this.messageForm.value
    ).subscribe({
      next: (response: any) => {
        this.alertService.addAlert({
          type: this.alertService.AlertTypes.SUCCESS,
          message: response.message
        }, true);
        this.messageForm.setValue({ body: '' });
        this.messageFormIsOpen = false;
        this.loading = false;
      }
    });
  }
}
