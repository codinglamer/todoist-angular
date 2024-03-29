import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class TouchedAndDirtyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: AbstractControl<any, any> | null,
    form: FormGroupDirective | NgForm | null): boolean {
    if (!control) {
      return false;
    }

    return control.touched && control.dirty && control.invalid;
  }
}
