import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequestDTO } from '../../../models/request/login-request-dto';
import { ResponseDTO } from '../../../models/response/response-dto';
import { TokenResponseDTO } from '../../../models/response/token-response-dto';
import { PathRest } from '../static/path-rest';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _http = inject(HttpClient);

  login(loginRequestDTO: LoginRequestDTO): Observable<ResponseDTO<TokenResponseDTO>> {
    return this._http.post<ResponseDTO<TokenResponseDTO>>(PathRest.LOGIN, loginRequestDTO);
  }
}
