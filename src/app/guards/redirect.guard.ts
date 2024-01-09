import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const redirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  const isValid = authService.isTokenValid(token!);

  if (isValid) {
    router.navigate(['/game']);
  }

  return !isValid;
};
