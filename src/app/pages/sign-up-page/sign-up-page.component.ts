import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ISignUpForm } from '../../forms/ISignUpForm';
import { UserService } from '../../services/user.service';
import { SignUpFormValidator } from '../../validators/SignUpFormValidator';

@Component({
  standalone: true,
  providers: [SignUpFormValidator],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.scss'
})
export class SignUpPageComponent {
  constructor(
    private signUpFormValidator: SignUpFormValidator,
    private userService: UserService,
    private router: Router
  ) {}

  showPassword = signal(false);
  creatingAccount = signal(false);
  creatingAccountFailed = signal(false);

  signUpForm: FormGroup = new FormGroup<ISignUpForm>({
    displayName: new FormControl(null),
    username: new FormControl(null, [
        SignUpFormValidator.usernameStartsWithLetter,
        Validators.minLength(5),
        Validators.maxLength(32),
        Validators.pattern(/^[a-zA-Z][a-zA-Z0-9]*(.[a-zA-Z0-9]+)*$/)
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

  // region getters
  // #region getters

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

  // #endregion
  // endregion

  getUsernameErrorMessage(): string | undefined {
    if (this.username.hasError('startsWithLetter')) {
      return 'The field must start with a letter';
    }
    if (this.username.hasError('pattern')) {
      return 'Can contain letters, digits and single dots as delimiter';
    }
    if (this.username.hasError('minlength')) {
      return 'Minimal length is 5';
    }
    if (this.username.hasError('maxlength')) {
      return 'Maximal length is 32';
    }
    if (this.username.hasError('notAvailable')) {
      return `${this.username.errors?.notAvailable} is not available`;
    }

    return undefined;
  }

  getEmailErrorMessage(): string | undefined {
    if (this.email.hasError('required')) {
      return 'Field is required';
    }
    if (this.email.hasError('email')) {
      return 'Not a valid email';
    }
    if (this.email.hasError('notAvailable')) {
      return `${this.email.errors?.notAvailable} is not available`;
    }

    return undefined;
  }

  getPasswordErrorMessage(): string | undefined {
    if (this.password.hasError('required')) {
      return 'Field is required';
    }
    if (this.password.hasError('minlength')) {
      return `Minimal length is ${this.password.errors?.minlength.requiredLength}`;
    }
    if (this.password.hasError('maxlength')) {
      return `Maximal length is ${this.password.errors?.maxlength.requiredLength}`;
    }

    return undefined;
  }

  getPasswordConfirmationErrorMessage(): string {
    if (this.passwordConfirmation.hasError('required')) {
      return 'Field is required';
    }

    return this.passwordConfirmation.hasError('different')
      ? 'Passwords are different' : '';
  }

  toggleShowPassword() {
    this.showPassword.update(show => !show);
  }

  async createAccount() {
    if (!this.signUpForm.errors) {
      const {passwordConfirmation, ...user} = this.signUpForm.value;

      try {
        this.creatingAccount.set(true);
        this.creatingAccountFailed.set(false);
        await this.userService.register(user);
        await this.router.navigateByUrl('need-verification');
      } catch (e) {
        this.creatingAccount.set(false);
        this.creatingAccountFailed.set(true);
      }
    }
  }
}
