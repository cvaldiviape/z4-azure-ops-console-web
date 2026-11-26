import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PathRest } from '../../modules/authentication/static/path-rest';
import { JwtService } from '../services/jwt.service';

// Agrega el token a todas las peticiones, menos al login (ahí todavía no hay token).
export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const jwtService = inject(JwtService);
  const authorizationHeader = jwtService.getAuthorizationHeader();
  const isLoginRequest = request.url.startsWith(PathRest.LOGIN);

  if (isLoginRequest || !authorizationHeader) {
    return next(request);
  }

  const requestWithToken = request.clone({ setHeaders: { Authorization: authorizationHeader } });
  return next(requestWithToken);
};
