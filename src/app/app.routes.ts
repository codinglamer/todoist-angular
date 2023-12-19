import { Routes } from "@angular/router";
import { TaskListPageComponent } from "./pages/task-list-page/task-list-page.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { SignUpPageComponent } from "./pages/sign-up-page/sign-up-page.component";

const appTitle = "Todoist";

export const routes: Routes = [
  {path: "", title: appTitle, component: TaskListPageComponent, pathMatch: "full"},
  {path: "login", title: `${appTitle} | Login`, component: LoginPageComponent},
  {path: "signup", title: `${appTitle} | Sign up`, component: SignUpPageComponent},
  {path: "**", redirectTo: ""}
];
