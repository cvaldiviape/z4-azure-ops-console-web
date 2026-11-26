import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../../models/common/jwt-payload';
import { TokenResponseDTO } from '../../models/response/token-response-dto';
import { LocalStorageJwt } from '../static/local-storage-jwt';
import { Roles } from '../static/roles';

// Guarda el token y responde preguntas sobre la sesión leyendo sus claims (roles, email, expiración).
@Injectable({ providedIn: 'root' })
export class JwtService {
  save(token: TokenResponseDTO): void {
    localStorage.setItem(LocalStorageJwt.TOKEN_ACCESS, token.accessToken);
    localStorage.setItem(LocalStorageJwt.TOKEN_TYPE, token.tokenType);
  }

  getAuthorizationHeader(): string | null {
    const tokenAccess = localStorage.getItem(LocalStorageJwt.TOKEN_ACCESS);
    const tokenType = localStorage.getItem(LocalStorageJwt.TOKEN_TYPE) ?? 'Bearer';
    return tokenAccess ? `${tokenType} ${tokenAccess}` : null;
  }

  isAuthenticated(): boolean {
    const payload = this.readPayload();
    return payload !== null && !this.isExpired(payload);
  }

  isAuthAdmin(): boolean {
    return this.isAuthenticated() && this.hasRole(Roles.ADMIN);
  }

  hasRole(role: string): boolean {
    const payload = this.readPayload();
    return payload?.roles?.includes(role) ?? false;
  }

  getEmail(): string {
    return this.readPayload()?.email ?? '';
  }

  logout(): void {
    localStorage.removeItem(LocalStorageJwt.TOKEN_ACCESS);
    localStorage.removeItem(LocalStorageJwt.TOKEN_TYPE);
  }

  private readPayload(): JwtPayload | null {
    const tokenAccess = localStorage.getItem(LocalStorageJwt.TOKEN_ACCESS);
    if (!tokenAccess) {
      return null;
    }
    try {
      return jwtDecode<JwtPayload>(tokenAccess);
    } catch {
      return null;
    }
  }

  private isExpired(payload: JwtPayload): boolean {
    const nowInSeconds = Date.now() / 1000;
    return payload.exp <= nowInSeconds;
  }
}
