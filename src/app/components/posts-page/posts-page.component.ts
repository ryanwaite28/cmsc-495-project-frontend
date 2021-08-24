import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlainObject } from 'src/app/interfaces/plain-object.interface';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-posts-page',
  templateUrl: './posts-page.component.html',
  styleUrls: ['./posts-page.component.scss']
})
export class PostsPageComponent implements OnInit {
  you;
  posts: PlainObject[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private userStore: UserStoreService,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe((you) => {
      this.you = you;
    });

    this.apiService.get_all_posts().subscribe((response) => {
      this.posts = response.posts;
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
