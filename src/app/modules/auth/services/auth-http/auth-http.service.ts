import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../models/auth.model';
import { LoginBeanModel } from '../../models/login-bean.model';
import { UserModel } from '../../models/user.model';

const API_USERS_URL = `${environment.apiUrl}/auth`;

const API_LOGIN = `${environment.apiUrl}/pfsvc/login/authenticate`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}

  // public methods
  login(email: string, password: string): Observable<any> {
    return this.http.post<AuthModel>(`${API_USERS_URL}/login`, {
      email,
      password,
    });
  }

  ibLogin(username: string, password: string): Observable<any> {
    const payload = {
      requestId: '121',
      newLoginBean: new LoginBeanModel(username, password),
    };
    return this.http.post<any>(`${API_LOGIN}`, payload, {
      headers: new HttpHeaders({
        channel: 'IBCustomer',
        inst: '1',
        'Content-Type': 'application/json',
      }),
    });
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
    });
  }

  getUserByToken(token: string): Observable<UserModel> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserModel>(`${API_USERS_URL}/me`, {
      headers: httpHeaders,
    });
  }
}
