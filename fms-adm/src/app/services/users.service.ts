import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../models/response-model';
import { map, Observable, take } from 'rxjs';
import { UserModel } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  base_url = `${environment.apiurl}`;

  constructor(private http: HttpClient) { }

  getAll(pageNumber: number, pageSize: number, search?: string): Observable<ResponseModel> {
    return this.http
      .get<ResponseModel>(`${this.base_url}api/user/v1/${pageNumber}/${pageSize}/{${search}}`)
      .pipe(
        take(1),
        map((response) => {
          if (!response.error) {
            return response;
          }
          throw new Error(response.message || 'Erro ao recuperar listagem de usuários.');
        })
      );
  }
}
