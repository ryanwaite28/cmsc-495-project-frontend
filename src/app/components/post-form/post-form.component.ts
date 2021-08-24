import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  @ViewChild('postFormElm', { static: false }) postFormElm: ElementRef<HTMLFormElement>;
  @Input() loading: boolean;
  @Input() is_editing: boolean;
  @Input() post;
  @Output('onFormSubmit') formSubmit = new EventEmitter<any>();
  
  errorMessage = '';
  TEXT_FORM_LIMIT = 250;
  COMMON_TEXT_VALIDATOR = [
    Validators.required,
    Validators.maxLength(this.TEXT_FORM_LIMIT)
  ];

  postForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    body: new FormControl('', [Validators.required]),
  }); 

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.is_editing) {
      this.postForm.get('title').setValue(this.post.title);
      this.postForm.get('body').setValue(this.post.body);
    }
  }

  submitPostForm() {
    const formData = new FormData();
    const payload = {
      body: this.postForm.value.body,
      industry: this.postForm.value.industry,
      tags: this.postForm.value.tags,
      filesInfo: []
    };
    formData.append('payload', JSON.stringify(payload));
    
    const dataObj = {
      formData,
      payload: this.postForm.value,
      form: this.postForm,
      formElm: this.postFormElm,
    };
    console.log(this, dataObj);

    this.formSubmit.emit(dataObj);
  }
}
