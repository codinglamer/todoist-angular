import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserService } from '../services/user.service';

export const notAuthGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.authedUser$.pipe(
    map(user => !user ? true : router.parseUrl(''))
  );
};
