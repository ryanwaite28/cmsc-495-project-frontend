import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertService } from './alert.service';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService extends ClientService {
  eventSource: EventSource;
  events: Subject<any>;

  constructor(
    public http: HttpClient,
    private alertService: AlertService,
  ) {
    super(http);
    this.events = new Subject<any>();
  }

  getEventsObs() {
    return this.events.asObservable();
  }

  listen(user_id: number) {
    if (!user_id) {
      return;
    }
    if (this.eventSource && this.eventSource.readyState !== 2) {
      // is either open or connecting; do not disturb
      return;
    }

    console.log(`subscribing to sse...`);
    const eventsUrl = this.API_PREFIX + '/subscribe';
    this.eventSource = new EventSource(eventsUrl);

    this.eventSource.onopen = (e) => {
      console.log(`connected to /subscribe sse stream`, e);
      this.events.next({ event: e });
    }

    this.eventSource.onerror = (e) => {
      console.log(`error on /subscribe sse stream`, e);
      this.events.next({ event: e });
    }

    this.eventSource.onmessage = (e) => {
      console.log(e);
      this.events.next({ event: e });
    }

    this.eventSource.addEventListener(`FOR-USER:${user_id}`, (e: MessageEvent) => {
      let parsed;
      try {
        parsed = JSON.parse(e.data);
        this.alertService.handleResponseSuccessGeneric({ message: parsed.message });
        this.events.next({ event: e, data: parsed, user_specific: true });
      } catch (e) {
        console.log(e);
      }
      console.log(`FOR-USER event`, e, parsed);
    })
  }

  close() {
    if (!this.eventSource) {
      return;
    }
    
    console.log(`closing sse...`);
    this.eventSource.close();
    this.eventSource = undefined;
  }
}
