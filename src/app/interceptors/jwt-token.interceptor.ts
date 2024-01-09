import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const jwtTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if (authService.isTokenValid(authService.getToken()!)) {
    const headers = req.headers.set('Authorization', `Bearer ${authService.getToken()}`);
    const clone = req.clone({ headers });
    return next(clone);
  }
  return next(req);
};
