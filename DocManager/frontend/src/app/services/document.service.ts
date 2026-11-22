import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from '../helpers/helpers';
import { Document, DocumentSearch } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  constructor(private http: HttpClient) {}

  search(f: DocumentSearch) {
    let params = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v) params = params.set(k, v as string); });
    return this.http.get<Document[]>(`${API_URL}/documents`, { params });
  }
  getById(id: number) { return this.http.get<Document>(`${API_URL}/documents/${id}`); }
  create(form: FormData) { return this.http.post<{ id: number }>(`${API_URL}/documents`, form); }
  update(id: number, form: FormData) { return this.http.put<{ id: number }>(`${API_URL}/documents/${id}`, form); }
  getFile(id: number) { return this.http.get(`${API_URL}/documents/${id}/file`, { responseType: 'blob' }); }
  delete(id: number) { return this.http.delete(`${API_URL}/documents/${id}`); }
}
