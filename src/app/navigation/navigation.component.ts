import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoutePaths } from '../app.routes';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit, OnDestroy {
  constructor(
    public userService: UserService,
    private router: Router
  ) {}

  public readonly RoutePaths = RoutePaths;

  ngOnInit(): void {
    this.userService.authedUser$.subscribe(async (user) => {
      if (!user) {
        await this.router.navigateByUrl(RoutePaths.Login);
      }
    });
  }

  ngOnDestroy(): void {
    this.userService.authedUser$.unsubscribe();
  }
}
