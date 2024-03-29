import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { RoutePaths } from '../../app.routes';
import { ErrorForControlDirective } from '../../directives/error-for-control.directive';
import { ILoginForm } from '../../forms/ILoginForm';
import { UserService } from '../../services/user.service';

@Component({
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    ErrorForControlDirective
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

  //#region getters

  get emailOrUsername() {
    return this.loginForm.controls.emailOrUsername;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  //#endregion

  toggleShowPassword() {
    this.showPassword.update(show => !show);
  }

  async login() {
    this.loginForm.markAllAsTouchedAndDirty();
    this.loginForm.updateAllValuesAndValidity();

    if (!this.loginForm.valid) {
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
