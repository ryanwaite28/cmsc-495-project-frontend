import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_JWT_NAME } from '../utils/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  DOMAIN: string;
  API_PREFIX: string;
  isProd: boolean;

  constructor(
    public http: HttpClient
  ) {
    const isProd = window.location.origin.includes('herokuapp');
    this.isProd = isProd;
    this.DOMAIN = this.isProd ? 'https://rmw-cmsc-495-project-backend.herokuapp.com' : `http://localhost:5000`;
    const apiDomain = this.DOMAIN + '';
    this.API_PREFIX = apiDomain;
    // console.log({ isProd, apiDomain }, this);
  }

  sendRequest<T>(
    route: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: object | FormData,
    customHeaders?: HttpHeaders,
    report_progress: boolean = false,
  ): Observable<T> {
    const api_url = this.API_PREFIX + route;
    const jwt = window.localStorage.getItem(APP_JWT_NAME) || '';
    const httpOptions: any = {
      withCredentials: method === 'GET' ? false : true,
      reportProgress: report_progress,
      headers: customHeaders || new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwt}`
      }),
    };
    if (data && data.constructor === Object) {
      httpOptions.headers.set('Content-Type', 'application/json');
    }

    let requestObservable: Observable<T>;

    switch (method) {
      case 'GET': {
        requestObservable = (<any> this.http.get(api_url, httpOptions)) as Observable<T>;
        break;
      }
      case 'POST': {
        requestObservable = (<any> this.http.post(api_url, data, httpOptions)) as Observable<T>;
        break;
      }
      case 'PUT': {
        requestObservable = (<any> this.http.put(api_url, data, httpOptions)) as Observable<T>;
        break;
      }
      case 'DELETE': {
        requestObservable = (<any> this.http.delete(api_url, httpOptions)) as Observable<T>;
        break;
      }
    }

    return requestObservable;
  }
}
