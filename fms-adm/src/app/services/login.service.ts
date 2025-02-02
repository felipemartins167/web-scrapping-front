import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginModel } from '../models/login-model';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  base_url = `${environment.apiurl}`;

  constructor(private http: HttpClient) { }

  async login(body: LoginModel): Promise<any> {
    return await this.http
      .post(`${this.base_url}api/auth/v1/login/${environment.environmentCode}`, body)
      .toPromise();
  }

  resetPassword(email: string): Observable<any> {
    return this.http
      .post<any>(`${this.base_url}api/auth/v1/reset/password/${email}`, {})
      .pipe(take(1));
  }
}
