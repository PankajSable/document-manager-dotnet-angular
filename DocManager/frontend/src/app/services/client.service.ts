import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../helpers/helpers';
import { Client, ClientDetail } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ClientService {
  constructor(private http: HttpClient) {}

  getAll(q = '') { return this.http.get<Client[]>(`${API_URL}/clients`, { params: q ? { q } : {} }); }
  getById(id: number) { return this.http.get<ClientDetail>(`${API_URL}/clients/${id}`); }
  save(c: Client) {
    return c.id ? this.http.put(`${API_URL}/clients/${c.id}`, c) : this.http.post(`${API_URL}/clients`, c);
  }
  delete(id: number) { return this.http.delete(`${API_URL}/clients/${id}`); }
}
