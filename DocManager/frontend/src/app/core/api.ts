import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, throwError } from 'rxjs';

const API = 'http://localhost:5000/api';

export interface Doc {
  id: number; documentId: string; clientId: number; clientName: string; phone?: string;
  documentType?: string; propertyAddress?: string; expiryDate?: string; notes?: string;
  fileName: string; contentType: string; fileSize: number; createdBy: string; createdAt: string; updatedAt?: string;
}
export interface Client { id: number; name: string; phone?: string; email?: string; address?: string; docCount?: number; documents?: Doc[]; }
export interface AppUser { id: number; username: string; role: string; isActive: boolean; }
export interface DashboardData { totalDocuments: number; totalClients: number; expired: number; expiringIn30: number; due: Doc[]; }

export const DOC_TYPES = ['Sale deed', 'Rent agreement', '7/12 extract', 'Property card', 'NOC',
  'Tax receipt', 'ID proof', 'Power of attorney', 'Brokerage agreement', 'Other'];

@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);
  get token() { return localStorage.getItem('token'); }
  get role() { return localStorage.getItem('role') ?? ''; }
  get username() { return localStorage.getItem('username') ?? ''; }
  get isAdmin() { return this.role === 'Admin'; }

  login(username: string, password: string) {
    return this.http.post<{ token: string; role: string; username: string }>(`${API}/auth/login`, { username, password })
      .pipe(tap(r => { localStorage.setItem('token', r.token); localStorage.setItem('role', r.role); localStorage.setItem('username', r.username); }));
  }
  logout() { ['token', 'role', 'username'].forEach(k => localStorage.removeItem(k)); }

  dashboard() { return this.http.get<DashboardData>(`${API}/dashboard`); }
  search(f: Record<string, string>) {
    let p = new HttpParams(); Object.entries(f).forEach(([k, v]) => v && (p = p.set(k, v)));
    return this.http.get<Doc[]>(`${API}/documents`, { params: p });
  }
  getDoc(id: number) { return this.http.get<Doc>(`${API}/documents/${id}`); }
  createDoc(fd: FormData) { return this.http.post<{ id: number }>(`${API}/documents`, fd); }
  updateDoc(id: number, fd: FormData) { return this.http.put<{ id: number }>(`${API}/documents/${id}`, fd); }
  file(id: number) { return this.http.get(`${API}/documents/${id}/file`, { responseType: 'blob' }); }
  removeDoc(id: number) { return this.http.delete(`${API}/documents/${id}`); }

  clients(q = '') { return this.http.get<Client[]>(`${API}/clients`, { params: q ? { q } : {} }); }
  client(id: number) { return this.http.get<Client>(`${API}/clients/${id}`); }
  saveClient(c: Partial<Client>) {
    return c.id ? this.http.put(`${API}/clients/${c.id}`, c) : this.http.post<{ id: number }>(`${API}/clients`, c);
  }
  removeClient(id: number) { return this.http.delete(`${API}/clients/${id}`); }

  users() { return this.http.get<AppUser[]>(`${API}/users`); }
  addUser(u: any) { return this.http.post(`${API}/users`, u); }
  updateUser(id: number, u: any) { return this.http.put(`${API}/users/${id}`, u); }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const t = localStorage.getItem('token'); const router = inject(Router);
  if (t) req = req.clone({ setHeaders: { Authorization: `Bearer ${t}` } });
  return next(req).pipe(catchError(e => {
    if (e.status === 401 && !req.url.includes('/auth/')) { localStorage.removeItem('token'); router.navigate(['/login']); }
    return throwError(() => e);
  }));
};

export function saveBlob(blob: Blob, name: string) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); URL.revokeObjectURL(a.href);
}
export const msg = (e: any) => typeof e.error === 'string' && e.error ? e.error : 'Something went wrong. Check the details and try again.';
export const daysLeft = (d?: string) => d ? Math.ceil((new Date(d).getTime() - Date.now()) / 864e5) : null;
