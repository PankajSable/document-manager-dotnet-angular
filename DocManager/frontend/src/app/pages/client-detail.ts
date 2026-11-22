import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Api, Client } from '../core/api';

@Component({
  imports: [RouterLink, DatePipe],
  template: `
  @if (c(); as c) {
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div><h1 class="h4 mb-1">{{ c.name }}</h1>
        <div class="text-secondary small">{{ c.phone }} {{ c.email }} {{ c.address }}</div></div>
      <a class="btn btn-dark" routerLink="/docs/new" [queryParams]="{ clientId: c.id }">Add document</a>
    </div>
    <table class="table align-middle"><thead><tr><th>Document ID</th><th>Type</th><th>Property</th><th>Expires</th><th>Added</th><th></th></tr></thead><tbody>
      @for (d of c.documents; track d.id) {
        <tr><td>{{ d.documentId }}</td><td>{{ d.documentType }}</td><td>{{ d.propertyAddress }}</td>
        <td>{{ d.expiryDate | date:'dd MMM yyyy' }}</td><td>{{ d.createdAt | date:'dd MMM yyyy' }}</td>
        <td class="text-end"><a class="btn btn-sm btn-outline-dark" [routerLink]="['/view', d.id]">Open</a></td></tr>
      } @empty { <tr><td colspan="6" class="text-center text-secondary py-4">This folder is empty.</td></tr> }
    </tbody></table>
  }`
})
export class ClientDetail implements OnInit {
  private api = inject(Api); private route = inject(ActivatedRoute); c = signal<Client | null>(null);
  ngOnInit() { this.api.client(Number(this.route.snapshot.paramMap.get('id'))).subscribe(r => this.c.set(r)); }
}
