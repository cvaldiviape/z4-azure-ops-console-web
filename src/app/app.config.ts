import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { errorInterceptor } from './security/interceptors/error.interceptor';
import { jwtInterceptor } from './security/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()), // parámetros de ruta y query params llegan como input()
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
  ],
};
