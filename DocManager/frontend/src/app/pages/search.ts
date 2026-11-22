import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Api, Doc, DOC_TYPES, saveBlob } from '../core/api';

@Component({
  imports: [FormsModule, RouterLink, DatePipe],
  template: `
  <h1 class="h4 mb-3">Search documents</h1>
  <form class="row g-2 mb-3" (ngSubmit)="find()">
    <div class="col-md-3"><input class="form-control" placeholder="Client name" name="n" [(ngModel)]="f['name']"></div>
    <div class="col-md-2"><input class="form-control" placeholder="Document ID" name="i" [(ngModel)]="f['documentId']"></div>
    <div class="col-md-2"><select class="form-select" name="t" [(ngModel)]="f['type']"><option value="">All types</option>@for (t of types; track t) { <option>{{ t }}</option> }</select></div>
    <div class="col-md-2"><input class="form-control" type="date" title="Created from" name="f" [(ngModel)]="f['from']"></div>
    <div class="col-md-2"><input class="form-control" type="date" title="Created to" name="to" [(ngModel)]="f['to']"></div>
    <div class="col-md-1 d-grid"><button class="btn btn-dark">Search</button></div>
  </form>
  <div class="table-responsive"><table class="table table-hover align-middle">
    <thead><tr><th>Document ID</th><th>Client</th><th>Type</th><th>Property</th><th>Created</th><th>Expires</th><th></th></tr></thead>
    <tbody>
      @for (d of rows(); track d.id) {
        <tr><td>{{ d.documentId }}</td><td>{{ d.clientName }}</td><td>{{ d.documentType }}</td><td>{{ d.propertyAddress }}</td>
          <td>{{ d.createdAt | date:'dd MMM yyyy' }}</td><td>{{ d.expiryDate | date:'dd MMM yyyy' }}</td>
          <td class="text-end text-nowrap"><a class="btn btn-sm btn-outline-dark me-1" [routerLink]="['/view', d.id]">View</a>
            <button class="btn btn-sm btn-dark" type="button" (click)="dl(d)">Download</button></td></tr>
      } @empty { <tr><td colspan="7" class="text-center text-secondary py-4">{{ loaded() ? 'No documents match. Try fewer filters.' : 'Loading…' }}</td></tr> }
    </tbody></table></div>`
})
export class Search implements OnInit {
  private api = inject(Api); types = DOC_TYPES; rows = signal<Doc[]>([]); loaded = signal(false);
  f: Record<string, string> = { name: '', documentId: '', type: '', from: '', to: '' };
  ngOnInit() { this.find(); }
  find() { this.api.search(this.f).subscribe(r => { this.rows.set(r); this.loaded.set(true); }); }
  dl(d: Doc) { this.api.file(d.id).subscribe(b => saveBlob(b, d.fileName)); }
}
