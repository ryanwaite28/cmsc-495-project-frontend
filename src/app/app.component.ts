import { Component } from '@angular/core';
import { AlertService } from './services/alert.service';
import { ApiService } from './services/api.service';
import { EventsService } from './services/events.service';
import { UserStoreService } from './stores/user-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cmsc495-project-client';

  constructor(
    private alertService: AlertService,
    private apiService: ApiService,
    private eventsService: EventsService,
    private userStore: UserStoreService,
  ) {}

  ngOnInit() {
    this.userStore.getChangesObs().subscribe((user) => {
      if (user) {
        this.eventsService.listen(user.id);
      } else {
        this.eventsService.close();
      }
    });
    
    this.apiService.checkUserSession().subscribe();
  }
}
