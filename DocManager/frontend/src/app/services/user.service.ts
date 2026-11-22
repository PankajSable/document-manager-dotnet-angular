import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../helpers/helpers';
import { AppUser, CreateUser, UpdateUser } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}
  getAll() { return this.http.get<AppUser[]>(`${API_URL}/users`); }
  create(u: CreateUser) { return this.http.post(`${API_URL}/users`, u); }
  update(id: number, u: UpdateUser) { return this.http.put(`${API_URL}/users/${id}`, u); }
}
