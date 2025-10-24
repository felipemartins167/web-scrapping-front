import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { LoginService } from './login.service';
import { TokenRefreshRequest } from '../models/token-refresh-request';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(LoginService);
  const router = inject(Router);

  const API_BASE_URL = 'https://fmswebscrapping.com.br/';

  // 🔒 Apenas modifica requisições que vão para a API principal
  if (!req.url.startsWith(API_BASE_URL) || req.url.includes('api/auth/v1/login/')) {
    return next(req); // Se não for da API, segue sem modificar
  }

  // Obtém o token armazenado
  const authToken = authService.getAuthData()?.token;

  // Clona a requisição e adiciona o token, se disponível
  let authReq = req;
  if (authToken) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${authToken}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handle401Error(authService, router, req, next);
      }
      return throwError(() => error);
    })
  );
};

// 🔄 Função para tratar erro 401 e tentar renovar o token
const handle401Error = (
  authService: LoginService,
  router: Router,
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  return authService.refreshToken().pipe(
    switchMap((newToken) => {
      // 🔄 Atualiza o token armazenado e refaz a requisição original
      authService.setAuthData(newToken);

      const newAuthReq = req.clone({
        setHeaders: { Authorization: `Bearer ${newToken.token}` }
      });
      return next(newAuthReq);
    }),
    catchError(() => {
      // ❌ Se o refresh token falhar, faz logout e redireciona
      authService.logout();
      router.navigate(['/login']);
      return throwError(() => new Error('Sessão expirada, faça login novamente.'));
    })
  );
};
