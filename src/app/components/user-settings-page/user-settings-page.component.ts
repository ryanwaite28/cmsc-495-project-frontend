import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PlainObject } from 'src/app/interfaces/plain-object.interface';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-user-settings-page',
  templateUrl: './user-settings-page.component.html',
  styleUrls: ['./user-settings-page.component.scss']
})
export class UserSettingsPageComponent implements OnInit {
  you: PlainObject;
  currentParams: Params;
  loading: boolean = false;
  initState = false;

  TEXT_FORM_LIMIT = 250;
  COMMON_TEXT_VALIDATOR = [
    Validators.required,
    Validators.maxLength(this.TEXT_FORM_LIMIT)
  ];

  userInfoForm = new FormGroup({
    displayname: new FormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    username: new FormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    bio: new FormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
  });

  userPasswordForm = new FormGroup({
    // oldPassword: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    password: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    confirmPassword: new FormControl('', this.COMMON_TEXT_VALIDATOR),
  });

  userIconForm = new FormGroup({
    file: new FormControl(null),
  });

  constructor(
    private userStore: UserStoreService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.currentParams = params;
    });

    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
      if (this.you && !this.initState) {
        this.initState = true;

        this.userInfoForm.setValue({
          displayname: this.you.displayname,
          username: this.you.username,
          bio: this.you.bio,
        });
      }
    });
  }

  onSubmitUserInfoForm() {
    this.loading = true;
    this.apiService.update_account(this.userInfoForm.value)
      .subscribe(
        (response) => {
          this.alertService.handleResponseSuccessGeneric(<any> response);
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.alertService.handleResponseErrorGeneric(error);
          this.loading = false;
        }
      );
  }

  onSubmitUserPasswordForm() {
    this.loading = true;
    this.apiService.update_password(this.userPasswordForm.value)
      .subscribe(
        (response) => {
          this.alertService.handleResponseSuccessGeneric(<any> response);
          this.userPasswordForm.reset({
            oldPassword: '',
            password: '',
            confirmPassword: '',
          });
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.alertService.handleResponseErrorGeneric(error);
          this.loading = false;
        }
      );
  }

  onSubmitUserIconForm(
    userIconFormElm: HTMLFormElement,
    fileInput: HTMLInputElement
  ) {
    // console.log({ userIconFormElm, fileInput });
    const formData = new FormData(userIconFormElm);
    const file = fileInput.files[0];
    if (!file) {
      const ask = window.confirm(
        `No file was found. Do you want to clear your icon?`
      );
      if (!ask) {
        return;
      }
    }
    formData.append('should_delete', 'true');
    this.loading = true;
    this.apiService.update_icon(formData)
      .subscribe(
        (response) => {
          this.alertService.handleResponseSuccessGeneric(<any> response);
          this.userIconForm.reset();
          fileInput.value = null;
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.alertService.handleResponseErrorGeneric(error);
          this.loading = false;
        }
      );
  }
}
