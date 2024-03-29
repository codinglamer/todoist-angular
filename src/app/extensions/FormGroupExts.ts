import { FormGroup } from '@angular/forms';

declare module '@angular/forms' {
  interface FormGroup {
    markAllAsDirty(this: FormGroup): void;

    markAllAsTouchedAndDirty(this: FormGroup): void;

    updateAllValuesAndValidity(this: FormGroup): void;
  }
}

function markAllAsDirty(this: FormGroup): void {
  Object.values(this.controls)
    .forEach(control => control.markAsDirty());
}

function markAllAsTouchedAndDirty(this: FormGroup): void {
  this.markAllAsTouched();
  this.markAllAsDirty();
}

function updateAllValuesAndValidity(this: FormGroup): void {
  Object.values(this.controls)
    .forEach(control => control.updateValueAndValidity());
}

FormGroup.prototype.markAllAsDirty = markAllAsDirty;
FormGroup.prototype.markAllAsTouchedAndDirty = markAllAsTouchedAndDirty;
FormGroup.prototype.updateAllValuesAndValidity = updateAllValuesAndValidity;
