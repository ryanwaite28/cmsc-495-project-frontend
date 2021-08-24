import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
  loading = false;
  errorMessage = '';
  TEXT_FORM_LIMIT = 250;
  COMMON_TEXT_VALIDATOR = [
    Validators.required,
    Validators.maxLength(this.TEXT_FORM_LIMIT)
  ];

  signupForm = new FormGroup({
    displayname: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    username: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    password: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    confirmpassword: new FormControl('', this.COMMON_TEXT_VALIDATOR),
  });

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {}

  onSubmit() {
    this.loading = true;
    this.apiService.sign_up(this.signupForm.value).subscribe(
      (response) => {
        this.loading = false;
        this.errorMessage = '';
        this.router.navigate(['/', 'users', response.user.id]);
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = error.error.message;
      }
    );
  }
}