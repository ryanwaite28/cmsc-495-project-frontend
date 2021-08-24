import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {
  @ViewChild('commentFormElm', { static: false }) commentFormElm: ElementRef<HTMLFormElement>;
  @Input() loading: boolean;
  @Input() is_editing: boolean;
  @Input() comment;
  @Output('onFormSubmit') formSubmit = new EventEmitter<any>();

  commentForm = new FormGroup({
    body: new FormControl('', [Validators.required]),
  });

  constructor() { }

  ngOnInit(): void {
    if (this.is_editing) {
      this.commentForm.setValue({
        body: this.comment.body,
      });
    }
  }

  submitCommentForm() {
    let formData = new FormData();
    Object.keys(this.commentForm.value).forEach((key) => {
      formData.append(key, this.commentForm.value[key]);
    });

    this.formSubmit.emit({
      formData,
      payload: this.commentForm.value,
      form: this.commentForm,
      formElm: this.commentFormElm,
    });
  }
}
