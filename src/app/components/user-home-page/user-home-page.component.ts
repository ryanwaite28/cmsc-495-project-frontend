import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlainObject } from 'src/app/interfaces/plain-object.interface';
import { IFormSubmitEvent } from 'src/app/interfaces/_common.interface';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss']
})
export class UserHomePageComponent implements OnInit {
  you: PlainObject;
  user: PlainObject;
  posts: PlainObject[] = [];
  loading: boolean = false;
  end_reached = true;

  get isYou(): boolean {
    const isYours = (
      this.you && 
      this.user &&
      this.user.id === this.you.id
    );
    return !!isYours;
  };

  constructor(
    private userStore: UserStoreService,
    private apiService: ApiService,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
    });

    this.route.data.subscribe((data) => {
      this.user = data.user;
      if (this.user) {
        this.getPosts();
      }
    });
  }

  getPosts() {
    const min_id =
      this.posts.length &&
      this.posts[this.posts.length - 1].id;
    this.loading = true;
    this.apiService.get_posts_by_user(this.user.id, min_id).subscribe({
      next: (response) => {
        for (const post of response.posts) {
          this.posts.push(post);
        }
        this.end_reached = response.posts.length < 5;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.loading = false;
      }
    });
  }

  createPost(event: IFormSubmitEvent) {
    // console.log(this, event);
    if (event.form.invalid) {
      return;
    }
    this.loading = true;
    this.apiService.create_post(event.payload).subscribe({
      next: (response) => {
        event.form.reset();
        this.alertService.handleResponseSuccessGeneric(<any> response);
        this.loading = false;
        this.posts.unshift(response.post);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.loading = false;
      }
    });
  }

  onDeletePost(post) {
    if (!post) {
      return;
    }
    const ask = window.confirm(`Are you sure you want to delete this post?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.apiService.delete_post(post.id).subscribe({
      next: (response: any) => {
        const index = this.posts.findIndex(p => p.id === post.id);
        this.posts.splice(index, 1);
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
