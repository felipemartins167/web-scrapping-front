import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginModel } from '../models/login-model';
import { catchError, map, Observable, take, throwError } from 'rxjs';
import { TokenRefreshRequest } from '../models/token-refresh-request';
import { LocalStorageVariables } from '../shared/variables/local-storage-variables';
import { ResponseModel } from '../models/response-model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  base_url = `${environment.apiurl}`;

  constructor(private http: HttpClient) { }

  login(body: LoginModel): Observable<string> {
    return this.http
      .post<ResponseModel>(`${this.base_url}api/auth/v1/login/${environment.environmentCode}`, body)
      .pipe(
        take(1),
        map(response => {
          if (!response.error) {
            localStorage.setItem(LocalStorageVariables.tokenRefreshToken, response.data);
            return 'Login efetuado com sucesso';
          }
          throw new Error(response.message || 'Erro ao realizar login');
        })
      );
  }

  resetPassword(email: string): Observable<string> {
    return this.http
      .post<ResponseModel>(`${this.base_url}api/auth/v1/reset/password/${email}`, {})
      .pipe(
        take(1),
        map(response => {
          if (!response.error) {
            return response.message || 'Solicitação de redefinição enviada com sucesso.';
          }
          throw new Error(response.message || 'Erro ao redefinir senha');
        })
      );
  }

  refreshToken(): Observable<TokenRefreshRequest> {
    const tokenRefreshToken = localStorage.getItem(LocalStorageVariables.tokenRefreshToken);

    if (!tokenRefreshToken) {
      return new Observable(observer => {
        observer.error(new Error('Nenhum refresh token encontrado'));
        observer.complete();
      });
    }

    return this.http
      .put<ResponseModel>(`${this.base_url}v1/token/refresh`, { refreshToken: JSON.parse(tokenRefreshToken).refreshToken })
      .pipe(
        take(1),
        map(response => {
          if (!response.error) {
            localStorage.setItem(LocalStorageVariables.tokenRefreshToken, response.data);
            return response.data.token;
          }
          throw new Error(response.message || 'Erro ao renovar token');
        }),
        catchError((error: any) => {
          console.error('Erro ao renovar token:', error);
          return throwError(() => new Error(error.message || 'Erro ao renovar token'));
        })
      );
  }

  logout() {
    localStorage.removeItem(LocalStorageVariables.tokenRefreshToken);
  }

  getAuthData(): TokenRefreshRequest | null {
    const loginData = localStorage.getItem(LocalStorageVariables.tokenRefreshToken);
    return loginData ? JSON.parse(loginData) : null;
  }

  setAuthData(data: TokenRefreshRequest) {
    localStorage.setItem(LocalStorageVariables.tokenRefreshToken, JSON.stringify(data));
  }
}
