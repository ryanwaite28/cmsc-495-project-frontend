import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlainObject } from 'src/app/interfaces/plain-object.interface';
import { IFormSubmitEvent } from 'src/app/interfaces/_common.interface';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() you;
  @Input() post;
  @Output('onDelete') onDelete = new EventEmitter<any>();

  end_reached = true;
  loading = false;
  showComments = false;
  firstShowComments = true;
  editorIsOpen: boolean = false;
  likes: PlainObject[] = [];
  comments: PlainObject[] = [];

  get you_liked(): boolean {
    const liked = (
      this.you &&
      this.likes.length > 0 &&
      this.likes.findIndex(like => like.owner.id == this.you.id) > -1
    );
    return liked;
  };

  get isYourPost(): boolean {
    const isYours = (
      this.you && 
      this.post &&
      this.post.owner.id === this.you.id
    );
    return isYours;
  };

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.getPostLikes();
  }

  getPostLikes() {
    const shouldCheck = this.you && this.post;
    if (shouldCheck) {
      this.apiService.get_post_likes(this.post.id).subscribe({
        next: (response) => {
          this.likes = response.post_likes;
        },
        error: (error: HttpErrorResponse) => {
          
        }
      });
    }
  }

  getComments() {
    const min_id =
      this.comments.length &&
      this.comments[this.comments.length - 1].id;
    this.loading = true;
    this.apiService.get_post_comments(this.post.id).subscribe({
      next: (response) => {
        for (const comment of response.comments) {
          this.comments.push(comment);
        }
        this.end_reached = response.comments.length < 5;
        this.loading = false;
      }
    });
  }

  toggleShowComments() {
    if (this.firstShowComments) {
      this.firstShowComments = false;
      this.getComments();
    }
    this.showComments = !this.showComments;
  }

  toggleLike() {
    this.apiService.toggle_user_post_like(this.you.id, this.post.id).subscribe({
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

  updatePost(event: IFormSubmitEvent) {
    console.log(this, event);
    if (event.form.invalid) {
      return;
    }
    this.loading = true;
    this.apiService.update_post(this.post.id, event.form.value).subscribe({
      next: (response: any) => {
        this.editorIsOpen = false;
        this.alertService.handleResponseSuccessGeneric(response);
        this.loading = false;
        this.post = response.post;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.loading = false;
      }
    });
  }

  deletePost() {
    this.onDelete.emit(this.post);
  }

  createComment(event: IFormSubmitEvent) {
    console.log(this, event);
    if (event.form.invalid) {
      return;
    }
    this.loading = true;
    this.apiService.create_comment(this.post.id, event.form.value).subscribe({
      next: (response: any) => {
        event.form.setValue({
          body: ''
        });
        event.form.reset();
        this.alertService.handleResponseSuccessGeneric(response);
        this.loading = false;
        this.comments.unshift(response.comment);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.loading = false;
      }
    });
  }

  onDeleteComment(comment) {
    if (!comment) {
      return;
    }
    const ask = window.confirm(`Are you sure you want to delete this comment?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.apiService.delete_comment(comment.id).subscribe({
      next: (response: any) => {
        const index = this.comments.findIndex(i => i.id === comment.id);
        this.comments.splice(index, 1);
        this.alertService.handleResponseSuccessGeneric(response);
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.loading = false;
      }
    });
  }
}
