import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlainObject } from 'src/app/interfaces/plain-object.interface';
import { IFormSubmitEvent } from 'src/app/interfaces/_common.interface';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() you;
  @Input() comment;
  @Output('onDelete') onDelete = new EventEmitter<any>();

  loading = false;
  editorIsOpen: boolean = false;
  likes: PlainObject[] = [];
  
  get isYourComment(): boolean {
    const isYours = (
      this.you && 
      this.comment &&
      this.comment.owner.id === this.you.id
    );
    return isYours;
  };

  get you_liked(): boolean {
    const liked = (
      this.you &&
      this.likes.length > 0 &&
      this.likes.findIndex(like => like.owner.id == this.you.id) > -1
    );
    return liked;
  };

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.getCommentLikes();
  }

  getCommentLikes() {
    const shouldCheck = this.you && this.comment;
    if (shouldCheck) {
      this.apiService.get_comment_likes(this.comment.id).subscribe({
        next: (response) => {
          this.likes = response.comment_likes;
        },
        error: (error: HttpErrorResponse) => {
          
        }
      });
    }
  }

  toggleLike() {
    this.apiService.toggle_user_comment_like(this.you.id, this.comment.id).subscribe({
      next: (response) => {
        if (response.like) {
          this.likes.push(response.like);
        } else {
          const index = this.likes.findIndex(l => l.owner.id === this.you.id);
          this.likes.splice(index, 1);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  updateComment(event: IFormSubmitEvent) {
    console.log(this, event);
    if (event.form.invalid) {
      return;
    }
    this.loading = true;
    this.apiService.update_comment(this.comment.id, event.payload).subscribe({
      next: (response: any) => {
        this.editorIsOpen = false;
        this.alertService.handleResponseSuccessGeneric(response);
        this.loading = false;
        this.comment = (<any> response.comment);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.loading = false;
      }
    });
  }

  deleteComment() {
    this.onDelete.emit(this.comment);
  }
}
