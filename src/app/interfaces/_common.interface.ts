import { ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PlainObject } from './plain-object.interface';

export interface IFormSubmitEvent {
  formData: FormData;
  payload: PlainObject;
  form: FormGroup;
  formElm: ElementRef<HTMLFormElement>;
}