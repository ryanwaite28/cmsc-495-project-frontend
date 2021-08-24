import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {
  you;
  post;
  current_params: Params;
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

    this.route.params.subscribe((params: Params) => {
      this.handleParamsChange(params);
    });
  }

  handleParamsChange(params: Params) {
    this.current_params = params;
    this.apiService.get_post_by_id(params.post_id).subscribe({
      next: (response) => {
        this.post = response.post;
      },
      error: (error: HttpErrorResponse) => {
        this.post = null;
      },
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
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.loading = false;
      }
    });
  }
}
