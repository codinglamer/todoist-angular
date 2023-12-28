import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NeedVerificationPageComponent } from './pages/need-verification/need-verification-page.component';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { TaskListPageComponent } from './pages/task-list-page/task-list-page.component';

const appTitle = "Todoist";

export const routes: Routes = [
  {path: "", title: appTitle, component: TaskListPageComponent, pathMatch: "full"},
  {path: "login", title: `${appTitle} | Login`, component: LoginPageComponent},
  {path: "signup", title: `${appTitle} | Sign up`, component: SignUpPageComponent},
  {path: "need-verification", title: `${appTitle} | Need verification`, component: NeedVerificationPageComponent},
  {path: "**", redirectTo: ""}
];
