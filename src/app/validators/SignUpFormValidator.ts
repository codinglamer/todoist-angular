import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { debounceTime, first, map, Observable } from 'rxjs';
import { CustomErrorNames } from '../errors/form-error.utils';
import { UserService } from '../services/user.service';

@Injectable()
export class SignUpFormValidator {
  constructor(private userService: UserService) {}

  // static displayName: ValidatorFn = (
  //   displayNameControl: AbstractControl
  // ): ValidationErrors | null => {
  //   if (!displayNameControl.value) {
  //     return null;
  //   }
  //
  //   const regexp = /^$/;
  //
  //   return regexp.test(displayNameControl.value)
  //     ? null : {};
  // };

  static usernameStartsWithLetter: ValidatorFn = (
    usernameControl: AbstractControl
  ): ValidationErrors | null => {
    if (!usernameControl.value) {
      return null;
    }

    return /^[a-zA-Z]$/.test(usernameControl.value?.substring(0, 1))
      ? null : {[CustomErrorNames.StartsWithLetter]: 'Username'};
  };

  usernameAvailable: AsyncValidatorFn = (
    usernameControl: AbstractControl
  ): Observable<ValidationErrors | null> => {
    return this.userService.isUsernameAvailable(usernameControl.value).pipe(
      debounceTime(1000),
      map(isFree => isFree ? null : {[CustomErrorNames.NotAvailable]: 'Username'}),
      first()
    );
  };

  emailAvailable: AsyncValidatorFn = (
    emailControl: AbstractControl
  ): Observable<ValidationErrors | null> => {
    return this.userService.isEmailAvailable(emailControl.value).pipe(
      debounceTime(1000),
      map(isFree => isFree ? null : {[CustomErrorNames.NotAvailable]: 'Email'}),
      first()
    );
  };

  static passwordConfirmed: ValidatorFn = (
    passwordConfirmationControl: AbstractControl
  ): ValidationErrors | null => {
    const group = passwordConfirmationControl.parent;
    const password = group?.get('password')?.value;
    const passwordConfirmation = passwordConfirmationControl.value;

    return password === passwordConfirmation ? null : {[CustomErrorNames.Match]: 'Passwords'};
  };
}
