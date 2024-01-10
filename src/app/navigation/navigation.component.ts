import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  constructor(public userService: UserService) {}
}
