import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginModel } from '../models/login-model';
import { catchError, map, Observable, take, throwError } from 'rxjs';
import { TokenRefreshRequest } from '../models/token-refresh-request';
import { LocalStorageVariables } from '../shared/variables/local-storage-variables';
import { ResponseModel } from '../models/response-model';
import { RegisterModel } from '../models/register-model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  base_url = `${environment.apiurl}`;

  constructor(private http: HttpClient) { }

  login(body: LoginModel, environment: number): Observable<string> {
    return this.http
      .post<ResponseModel>(`${this.base_url}api/auth/v1/login/${environment}`, body)
      .pipe(
        take(1),
        map(response => {
          console.log(response);
          if (!response.error) {
            localStorage.setItem(LocalStorageVariables.tokenRefreshToken, JSON.stringify(response.data));
            return 'Login efetuado com sucesso';
          }
          console.log(response);
          throw new Error(response.message || 'Erro ao realizar login');
        })
      );
  }

  register(body: RegisterModel): Observable<string> {
    return this.http
      .post<ResponseModel>(`${this.base_url}api/auth/v1/user`, body)
      .pipe(
        take(1),
        map(response => {
          console.log(response);
          if (!response.error) {
            localStorage.setItem(LocalStorageVariables.tokenRefreshToken, JSON.stringify(response.data));
            return 'Usuário registrado com sucesso';
          }
          console.log(response);
          throw new Error(response.message || 'Erro ao realizar registro de usuário');
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

  verifyEmailExists(email: string): Observable<string> {
    return this.http
      .get<ResponseModel>(`${this.base_url}api/auth/v1/verify/email/${email}`, {})
      .pipe(
        take(1),
        map(response => {
          console.log(response);
          if (!response.error) {
            return response.message || 'E-mail validado com sucesso.';
          }
          console.log(response.message);
          throw new Error(response.message || 'Erro ao verificar e-mail do usuário!');
        }),
        catchError((error: any) => {
          console.error('Erro ao verificar e-mail do usuário: ', error);
          return throwError(() => new Error(error.message || 'Erro ao verificar e-mail do usuário!'));
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
