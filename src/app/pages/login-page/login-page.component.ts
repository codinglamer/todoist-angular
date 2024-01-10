import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { RoutePaths } from '../../app.routes';
import { ILoginForm } from '../../forms/ILoginForm';
import { UserService } from '../../services/user.service';

@Component({
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  showPassword = signal(false);
  tryingToLogin = signal(false);
  loginFailed = signal(false);

  loginForm: FormGroup = new FormGroup<ILoginForm>({
    emailOrUsername: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  });

  // region getters
  // #region getters

  get emailOrUsername() {
    return this.loginForm.controls.emailOrUsername;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  // #endregion
  // endregion

  getEmailOrUsernameErrorMessage(): string | undefined {
    if (this.emailOrUsername.hasError('required')) {
      return 'Field is required';
    }

    return undefined;
  }

  getPasswordErrorMessage(): string | undefined {
    if (this.password.hasError('required')) {
      return 'Field is required';
    }

    return undefined;
  }

  toggleShowPassword() {
    this.showPassword.update(show => !show);
  }

  async login() {
    if (this.loginForm.errors) {
      return;
    }

    const isEmail = !Validators.email(this.emailOrUsername);

    try {
      this.tryingToLogin.set(true);
      this.loginFailed.set(false);
      await this.userService.login(isEmail, this.emailOrUsername.value, this.password.value);
      await this.router.navigateByUrl(RoutePaths.Main);
    } catch (e) {
      this.tryingToLogin.set(false);
      this.loginFailed.set(true);
    }
  }
}
