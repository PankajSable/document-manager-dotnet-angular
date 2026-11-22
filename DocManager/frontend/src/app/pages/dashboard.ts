import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Api, DashboardData, daysLeft } from '../core/api';

@Component({
  imports: [RouterLink, DatePipe],
  template: `
  <h1 class="h4 mb-3">Dashboard</h1>
  @if (d(); as d) {
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3"><div class="border rounded p-3"><div class="fs-3">{{ d.totalClients }}</div><div class="text-secondary small">Clients</div></div></div>
      <div class="col-6 col-md-3"><div class="border rounded p-3"><div class="fs-3">{{ d.totalDocuments }}</div><div class="text-secondary small">Documents</div></div></div>
      <div class="col-6 col-md-3"><div class="border border-danger rounded p-3"><div class="fs-3 text-danger">{{ d.expired }}</div><div class="text-secondary small">Expired</div></div></div>
      <div class="col-6 col-md-3"><div class="border border-warning rounded p-3"><div class="fs-3 text-warning-emphasis">{{ d.expiringIn30 }}</div><div class="text-secondary small">Expiring in 30 days</div></div></div>
    </div>
    <h2 class="h5">Needs attention (expired or due within 60 days)</h2>
    <div class="table-responsive"><table class="table align-middle">
      <thead><tr><th>Status</th><th>Document ID</th><th>Client</th><th>Type</th><th>Expiry</th><th>Phone</th><th></th></tr></thead>
      <tbody>
        @for (x of d.due; track x.id) {
          <tr><td>
            @if (left(x.expiryDate)! < 0) { <span class="badge text-bg-danger">Expired {{ -left(x.expiryDate)! }}d ago</span> }
            @else if (left(x.expiryDate)! <= 30) { <span class="badge text-bg-warning">{{ left(x.expiryDate) }}d left</span> }
            @else { <span class="badge text-bg-info">{{ left(x.expiryDate) }}d left</span> }
          </td><td>{{ x.documentId }}</td><td><a [routerLink]="['/clients', x.clientId]">{{ x.clientName }}</a></td>
          <td>{{ x.documentType }}</td><td>{{ x.expiryDate | date:'dd MMM yyyy' }}</td><td>{{ x.phone }}</td>
          <td class="text-end"><a class="btn btn-sm btn-outline-dark" [routerLink]="['/view', x.id]">Open</a></td></tr>
        } @empty { <tr><td colspan="7" class="text-center text-secondary py-4">Nothing is expiring soon.</td></tr> }
      </tbody></table></div>
  }`
})
export class Dashboard implements OnInit {
  private api = inject(Api); d = signal<DashboardData | null>(null); left = daysLeft;
  ngOnInit() { this.api.dashboard().subscribe(r => this.d.set(r)); }
}
