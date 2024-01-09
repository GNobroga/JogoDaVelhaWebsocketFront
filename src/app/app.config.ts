import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { jwtTokenInterceptor } from './interceptors/jwt-token.interceptor';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideToastr({
      timeOut: 1000,
      progressBar: true,
      progressAnimation: 'increasing',
    }),
    importProvidersFrom(JwtModule.forRoot({})),
    provideHttpClient(),
      provideHttpClient(
        withInterceptors([jwtTokenInterceptor])
    ),
  ]
};
