import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { API_URL } from '../helpers/helpers';
import { LoginResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  get token() { return localStorage.getItem('token'); }
  get role() { return localStorage.getItem('role') ?? ''; }
  get username() { return localStorage.getItem('username') ?? ''; }
  get isAdmin() { return this.role === 'Admin'; }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, { username, password }).pipe(
      tap(r => {
        localStorage.setItem('token', r.token);
        localStorage.setItem('role', r.role);
        localStorage.setItem('username', r.username);
      }));
  }

  logout() {
    ['token', 'role', 'username'].forEach(k => localStorage.removeItem(k));
  }
}
