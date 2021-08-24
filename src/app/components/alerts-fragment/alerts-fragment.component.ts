import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IAlert } from 'src/app/interfaces/alert.interface';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-alerts-fragment',
  templateUrl: './alerts-fragment.component.html',
  styleUrls: ['./alerts-fragment.component.scss']
})
export class AlertsFragmentComponent implements OnInit {
  alertsList: IAlert[] = [];

  subscription: Subscription;
  TIMEOUT_DURATION = 1000 * 5;

  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.subscription = this.alertService.getObservabe().subscribe((params) => {
      this.alertsList.push(params.alertObj);
      if (params.autoClose) {
        setTimeout(() => {
          this.closeAlert();
        }, this.TIMEOUT_DURATION);
      }
    });
  }

  closeAlert() {
    const alert = this.alertsList.shift();
  }
}
