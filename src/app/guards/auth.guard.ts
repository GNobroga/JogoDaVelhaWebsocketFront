import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const router = inject(Router);
  const isValid = authService.isTokenValid(token!);

  if (isValid) {
    return true;
  }

  router.navigate(['/account']);

  return !isValid;
};
