import { TestBed } from '@angular/core/testing';
import { JwtService } from './jwt.service';

// Arma un JWT de prueba (sin firma válida: el front solo lee los claims).
function buildToken(claims: Record<string, unknown>): string {
  const encode = (value: unknown) => btoa(JSON.stringify(value)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(claims)}.firma`;
}

describe('JwtService', () => {
  let jwtService: JwtService;
  const inOneHour = Math.floor(Date.now() / 1000) + 3600;
  const oneHourAgo = Math.floor(Date.now() / 1000) - 3600;

  beforeEach(() => {
    localStorage.clear();
    jwtService = TestBed.inject(JwtService);
  });

  it('reconoce a un ADMIN con sesión vigente', () => {
    const accessToken = buildToken({ sub: '1', email: 'admin@z4.com', roles: ['ADMIN', 'CUSTOMER'], exp: inOneHour });
    jwtService.save({ accessToken, tokenType: 'Bearer', expiresIn: 3600 });

    expect(jwtService.isAuthAdmin()).toBe(true);
    expect(jwtService.getEmail()).toBe('admin@z4.com');
    expect(jwtService.getAuthorizationHeader()).toBe(`Bearer ${accessToken}`);
  });

  it('no deja entrar a un usuario sin rol ADMIN', () => {
    const accessToken = buildToken({ sub: '2', email: 'cliente@z4.com', roles: ['CUSTOMER'], exp: inOneHour });
    jwtService.save({ accessToken, tokenType: 'Bearer', expiresIn: 3600 });

    expect(jwtService.isAuthenticated()).toBe(true);
    expect(jwtService.isAuthAdmin()).toBe(false);
  });

  it('considera vencido un token expirado', () => {
    const accessToken = buildToken({ sub: '1', email: 'admin@z4.com', roles: ['ADMIN'], exp: oneHourAgo });
    jwtService.save({ accessToken, tokenType: 'Bearer', expiresIn: 3600 });

    expect(jwtService.isAuthenticated()).toBe(false);
    expect(jwtService.isAuthAdmin()).toBe(false);
  });

  it('borra la sesión al cerrar', () => {
    const accessToken = buildToken({ sub: '1', email: 'admin@z4.com', roles: ['ADMIN'], exp: inOneHour });
    jwtService.save({ accessToken, tokenType: 'Bearer', expiresIn: 3600 });
    jwtService.logout();

    expect(jwtService.getAuthorizationHeader()).toBeNull();
    expect(jwtService.isAuthenticated()).toBe(false);
  });
});
