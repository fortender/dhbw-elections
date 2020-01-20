import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../user';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';

import { JwtHelperService } from '@auth0/angular-jwt';

const jwtHelper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient,
              private alert: AlertService) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    if (this.currentUserValue === null) {
      return false;
    }
    const token = jwtHelper.decodeToken(this.currentUserValue.token);
    if (token.exp <= Date.now()) {
      localStorage.removeItem('user');
      this.currentUserSubject.next(null);
      return false;
    }
    return true;
  }

  login(mail: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/users/login`, { username: mail, password })
      .pipe(map(user => {
        // Successful login -> store jwt token in local storage
        if (user && user.token) {
          user.username = mail;
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  logout() {
    // Clean local storage from user data
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.alert.success('Successfully logged out', true);
  }

}
