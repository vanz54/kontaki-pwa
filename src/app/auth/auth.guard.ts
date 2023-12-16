import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/* auth.guard is the guard that prevents the user to 
access to url in which it cannot access until it is logged in */

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  if (authService.isLoggedIn !== true) {
    router.navigate(['sign-in']);
  }
  return true;
};
