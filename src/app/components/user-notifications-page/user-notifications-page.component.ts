import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlainObject } from 'src/app/interfaces/plain-object.interface';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-user-notifications-page',
  templateUrl: './user-notifications-page.component.html',
  styleUrls: ['./user-notifications-page.component.scss']
})
export class UserNotificationsPageComponent implements OnInit {
  you: PlainObject;
  notifications: PlainObject[] = [];

  constructor(
    private userStore: UserStoreService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
      if (this.you) {
        this.apiService.get_user_notifications(this.you.id).subscribe((response) => {
          this.notifications = response.notifications;
        });
      }
    });
  }
}
