import { Component, OnInit } from '@angular/core';
import { PlainObject } from 'src/app/interfaces/plain-object.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {
  users: PlainObject[] = [];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.apiService.get_all_users().subscribe((response) => {
      this.users = response.users;
    });
  }

}
