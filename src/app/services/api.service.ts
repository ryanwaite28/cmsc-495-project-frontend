import { Injectable } from '@angular/core';
import { PlainObject } from '../interfaces/plain-object.interface';
import { UserStoreService } from '../stores/user-store.service';
import { flatMap, map } from 'rxjs/operators';
import { ClientService } from './client.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { APP_JWT_NAME } from '../utils/app.constants';
import { EventsService } from './events.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService extends ClientService {
  session;
  sessionChecked: boolean;
  checkCalled = false;

  constructor(
    public http: HttpClient,
    private userStore: UserStoreService,
    private eventsService: EventsService,
  ) {
    super(http);
  }


  // Users

  get_all_users() {
    const endpoint = `/users/all`;
    return this.sendRequest<{ users: PlainObject[]; }>(endpoint, `GET`);
  }

  checkUserSession() {
    return this.userStore.getChangesObs().pipe(
      flatMap((you: PlainObject) => {
        return you !== undefined
          ? of(you)
          : this.checkSession().pipe(
              map((response: PlainObject) => {
                return response.user || null;
              })
            );
      })
    );
  }

  private checkSession() {
    const jwt = window.localStorage.getItem(APP_JWT_NAME);
    if (!jwt) {
      return of(<PlainObject> {
        error: true,
        status: HttpStatusCode.REQUEST_FAILED,
        message: `no token found`
      });
    }
    return this.sendRequest<PlainObject>(
      '/check_session',
      `GET`,
      null,
    ).pipe(
      map((response) => {
        this.session = response;
        if (!response.error) {
          this.userStore.setState(response.user);
          this.sessionChecked = true;
        }
        return response;
      })
    );
  }

  get_user_by_id(id) {
    const endpoint = `/users/${id}`;
    return this.sendRequest<{ user: PlainObject; }>(endpoint, `GET`);
  }

  get_user_notifications(id) {
    const endpoint = `/users/${id}/notifications`;
    return this.sendRequest<{ notifications: PlainObject[]; }>(endpoint, `GET`);
  }

  get_user_messagings(id) {
    const endpoint = `/users/${id}/messagings`;
    return this.sendRequest<{ messagings: PlainObject[]; }>(endpoint, `GET`);
  }

  get_user_messages_with_other_user(user_id, other_id) {
    const endpoint = `/users/${user_id}/messagings/${other_id}/messages`;
    return this.sendRequest<{ messages: PlainObject[]; }>(endpoint, `GET`);
  }

  get_user_followers(id) {
    const endpoint = `/users/${id}/followers`;
    return this.sendRequest<{ followers: PlainObject[]; }>(endpoint, `GET`);
  }

  get_user_followings(id) {
    const endpoint = `/users/${id}/followings`;
    return this.sendRequest<{ followings: PlainObject[]; }>(endpoint, `GET`);
  }

  check_user_follows(you_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/check-follow/${user_id}`;
    return this.sendRequest<{ following: boolean; }>(endpoint, `GET`);
  }

  check_user_post_like(you_id: number, post_id: number) {
    const endpoint = `/users/${you_id}/check-post-like/${post_id}`;
    return this.sendRequest<{ post_likes: PlainObject | null; }>(endpoint, `GET`);
  }

  check_user_comment_like(user_id: number, comment_id: number) {
    const endpoint = `/users/${user_id}/check-comment-like/${comment_id}`;
    return this.sendRequest<{ comment_likes: PlainObject | null; }>(endpoint, `GET`);
  }

  sign_up(data: PlainObject) {
    return this.sendRequest<PlainObject>('/sign_up', `POST`, data).pipe(
      map((response) => {
        window.localStorage.setItem(APP_JWT_NAME, response.token);
        this.userStore.setState(response.user);
        return response;
      })
    );
  }

  sign_in(data: PlainObject) {
    return this.sendRequest<PlainObject>('/sign_in', `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem(APP_JWT_NAME, response.token);
        this.userStore.setState(response.user);
        return response;
      })
    );
  }

  sign_out() {
    this.userStore.setState(null);
    window.localStorage.removeItem(APP_JWT_NAME);
  }

  update_account(data: PlainObject) {
    const endpoint = `/update_account`;
    return this.sendRequest<PlainObject>(endpoint, `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem(APP_JWT_NAME, response.token);
        this.userStore.mergeState(response.data);
        return response;
      })
    );
  }

  update_password(data: PlainObject) {
    const endpoint = `/update_password`;
    return this.sendRequest<PlainObject>(endpoint, `PUT`, data);
  }

  update_icon(formData: FormData) {
    const endpoint = `/update_icon`;
    return this.sendRequest<PlainObject>(endpoint, `PUT`, formData).pipe(
      map((response) => {
        window.localStorage.setItem(APP_JWT_NAME, response.token);
        this.userStore.mergeState(response.data);
        return response;
      })
    );
  }

  toggle_user_follow(user_id, follows_id) {
    const endpoint = `/users/${user_id}/toggle-follow/${follows_id}`;
    return this.sendRequest<PlainObject>(endpoint, `PUT`, null);
  }

  toggle_user_post_like(user_id, post_id) {
    const endpoint = `/users/${user_id}/toggle-post-like/${post_id}`;
    return this.sendRequest<PlainObject>(endpoint, `PUT`, null);
  }

  toggle_user_comment_like(user_id, comment_id) {
    const endpoint = `/users/${user_id}/toggle-comment-like/${comment_id}`;
    return this.sendRequest<PlainObject>(endpoint, `PUT`, null);
  }

  delete_user(id) {
    return this.sendRequest<PlainObject>('/users/' + id, `GET`);
  }


  // Posts

  get_all_posts() {
    const endpoint = `/posts/all`;
    return this.sendRequest<{ posts: PlainObject[]; }>(endpoint, `GET`);
  }

  get_posts_by_user(user_id: number, min_id?: number, get_all?: boolean) {
    const endpoint = get_all
      ? '/users/' + user_id + '/posts/all'
      : min_id
        ? '/users/' + user_id + '/posts/paginate/' + min_id
        : '/users/' + user_id + '/posts';
    return this.sendRequest<{ posts: PlainObject[]; }>(endpoint, `GET`);
  }

  get_post_by_id(id) {
    const endpoint = `/posts/${id}`;
    return this.sendRequest<{ post: PlainObject; }>(endpoint, `GET`);
  }

  get_post_likes(id) {
    const endpoint = `/posts/${id}/likes`;
    return this.sendRequest<{ post_likes: PlainObject[]; }>(endpoint, `GET`);
  }

  get_post_comments(id) {
    const endpoint = `/posts/${id}/comments`;
    return this.sendRequest<{ comments: PlainObject[]; }>(endpoint, `GET`);
  }

  create_post(data: PlainObject) {
    return this.sendRequest<PlainObject>('/posts', `POST`, data);
  }

  update_post(id, data: PlainObject) {
    return this.sendRequest<PlainObject>('/posts/' + id, `PUT`, data);
  }

  delete_post(id) {
    return this.sendRequest<PlainObject>('/posts/' + id, `DELETE`);
  }


  // Comments

  get_comment_likes(id) {
    return this.sendRequest<PlainObject>(`/comments/${id}/likes`, `GET`);
  }

  create_comment(post_id: number, data: PlainObject) {
    return this.sendRequest<PlainObject>(`/posts/${post_id}/comments`, `POST`, data);
  }

  update_comment(comment_id: number, data: PlainObject) {
    return this.sendRequest<PlainObject>(`/comments/${comment_id}`, `PUT`, data);
  }

  delete_comment(comment_id: number) {
    return this.sendRequest<PlainObject>(`/comments/${comment_id}`, `DELETE`);
  }


  // Messages

  send_user_message(user_id, other_id, data: PlainObject) {
    const endpoint = `/users/${user_id}/messagings/${other_id}/messages`;
    return this.sendRequest<{ message: string; data: PlainObject[]; }>(endpoint, `POST`, data);
  }
}
