import { Injectable } from '@angular/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class DirtyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: AbstractControl<any, any> | null,
    form: FormGroupDirective | NgForm | null): boolean {
    if (!control) {
      return false;
    }

    return control.dirty && control.invalid;
  }
}
