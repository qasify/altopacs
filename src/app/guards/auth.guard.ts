import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return true

  const isLoggedIn = authService.isLoggedIn();

  if (isLoggedIn) {
    if (state.url === '/login') {
      router.navigate(['/']);
      return false;
    }

    return true;
  } else {
    if (state.url !== '/login') {
      router.navigate(['/login']);
      return false;
    }
    return true;
  }
};
