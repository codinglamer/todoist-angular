import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import XRegExp from 'xregexp';
import { RoutePaths } from '../../app.routes';
import { ErrorForControlDirective } from '../../directives/error-for-control.directive';
import { HintForControlDirective } from '../../directives/hint-for-control.directive';
import { DirtyErrorStateMatcher } from '../../errors/dirty-error-state-matcher';
import { ErrorMessageGetter } from '../../errors/form-error.utils';
import { ISignUpForm } from '../../forms/ISignUpForm';
import { UserService } from '../../services/user.service';
import { SignUpFormValidator } from '../../validators/SignUpFormValidator';
import '../../extensions/FormGroupExts';

@Component({
  standalone: true,
  providers: [SignUpFormValidator],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    ErrorForControlDirective,
    HintForControlDirective
  ],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.scss'
})
export class SignUpPageComponent {
  constructor(
    public dirtyErrorStateMatcher: DirtyErrorStateMatcher,
    private signUpFormValidator: SignUpFormValidator,
    private userService: UserService,
    private router: Router
  ) {}

  showPassword = signal(false);
  creatingAccount = signal(false);
  creatingAccountFailed = signal(false);

  signUpForm: FormGroup = new FormGroup<ISignUpForm>({
    displayName: new FormControl(null, [
      Validators.minLength(2),
      Validators.maxLength(32),
      Validators.pattern(XRegExp.tag()`^[\p{L}- ]+$`),
      // Validators.pattern(/^[^\W0-9_]+$/)
    ]),
    username: new FormControl(null, [
        SignUpFormValidator.usernameStartsWithLetter,
        Validators.minLength(5),
        Validators.maxLength(32),
        Validators.pattern(/^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z0-9]+)*$/)
      ], this.signUpFormValidator.usernameAvailable
    ),
    email: new FormControl(null, [
      Validators.required,
      Validators.email
    ], this.signUpFormValidator.emailAvailable),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32)
    ]),
    passwordConfirmation: new FormControl(null, [
      Validators.required,
      SignUpFormValidator.passwordConfirmed
    ])
  });

  //#region getters

  get displayName() {
    return this.signUpForm.controls.displayName;
  }

  get username() {
    return this.signUpForm.controls.username;
  }

  get email() {
    return this.signUpForm.controls.email;
  }

  get password() {
    return this.signUpForm.controls.password;
  }

  get passwordConfirmation() {
    return this.signUpForm.controls.passwordConfirmation;
  }

  //#endregion

  usernameErrorMessages: [string, ErrorMessageGetter][] = [
    ['pattern', () => 'Can contain letters, digits and single dots as delimiter']
  ];

  toggleShowPassword() {
    this.showPassword.update(show => !show);
  }

  async createAccount() {
    // this.signUpForm.markAllAsTouched();
    // Object.values(this.signUpForm.controls)
    //   .forEach(control => {
    //     control.markAsDirty();
    //     control.updateValueAndValidity();
    //   });

    this.signUpForm.markAllAsTouchedAndDirty();
    this.signUpForm.updateAllValuesAndValidity();

    console.log(this.signUpForm);
    if (!this.signUpForm.valid) {
      return;
    }

    // Cause: pending state when updateValueAndValidity() called
    console.log('How are we here?');

    const {passwordConfirmation, ...user} = this.signUpForm.value;

    try {
      this.creatingAccount.set(true);
      this.creatingAccountFailed.set(false);

      await this.userService.register(user);
      await this.router.navigateByUrl(RoutePaths.NeedVerification);
    } catch (e) {
      this.creatingAccount.set(false);
      this.creatingAccountFailed.set(true);
    }
  }
}
