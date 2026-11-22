import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../helpers/helpers';
import { Dashboard } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}
  get() { return this.http.get<Dashboard>(`${API_URL}/dashboard`); }
}
