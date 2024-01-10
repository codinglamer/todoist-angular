import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import {
  NeedVerificationPageComponent
} from './pages/need-verification/need-verification-page.component';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { TaskListPageComponent } from './pages/task-list-page/task-list-page.component';

const appTitle = 'Todoist';

export enum RoutePaths {
  Main = '',
  Login = 'login',
  SignUp = 'signup',
  NeedVerification = 'need-verification'
}

export const routes: Routes = [
  {
    path: RoutePaths.Main,
    title: appTitle,
    component: TaskListPageComponent,
    canActivate: [authGuard],
    pathMatch: 'full'
  },
  {
    path: RoutePaths.Login,
    title: `${appTitle} | Log in`,
    component: LoginPageComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: RoutePaths.SignUp,
    title: `${appTitle} | Sign up`,
    component: SignUpPageComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: RoutePaths.NeedVerification,
    title: `${appTitle} | Need verification`,
    component: NeedVerificationPageComponent,
    canActivate: [noAuthGuard]
  },
  {path: '**', redirectTo: ''}
];
