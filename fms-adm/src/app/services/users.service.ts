import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  base_url = `${environment.apiurl}`;

  constructor(private http: HttpClient) { }

  async getAll(pageNumber: number, pageSize: number, search?: string): Promise<any> {
    return await this.http
      .get(`${this.base_url}api/user/v1/${pageNumber}/${pageSize}/{${search}}`)
      .toPromise();
  }
}
