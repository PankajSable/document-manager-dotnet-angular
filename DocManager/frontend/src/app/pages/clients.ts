import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Api, Client, msg } from '../core/api';

@Component({
  imports: [FormsModule, RouterLink],
  template: `
  <h1 class="h4 mb-3">Clients</h1>
  <div class="row g-4">
    <div class="col-lg-4">
      <form class="border rounded p-3" (ngSubmit)="save()">
        <h2 class="h6">{{ m.id ? 'Edit client' : 'New client' }}</h2>
        <input class="form-control mb-2" placeholder="Name *" name="n" [(ngModel)]="m.name" required>
        <input class="form-control mb-2" placeholder="Phone" name="p" [(ngModel)]="m.phone">
        <input class="form-control mb-2" placeholder="Email" name="e" [(ngModel)]="m.email">
        <input class="form-control mb-2" placeholder="Address" name="a" [(ngModel)]="m.address">
        @if (err()) { <div class="alert alert-danger py-2">{{ err() }}</div> }
        <button class="btn btn-dark btn-sm me-2">Save client</button>
        @if (m.id) { <button type="button" class="btn btn-link btn-sm" (click)="m = {}">Cancel</button> }
      </form>
    </div>
    <div class="col-lg-8">
      <input class="form-control mb-3" placeholder="Search by name or phone" [(ngModel)]="q" (ngModelChange)="load()">
      <table class="table align-middle"><thead><tr><th>Name</th><th>Phone</th><th>Documents</th><th></th></tr></thead><tbody>
        @for (c of rows(); track c.id) {
          <tr><td><a [routerLink]="['/clients', c.id]">{{ c.name }}</a></td><td>{{ c.phone }}</td><td>{{ c.docCount }}</td>
          <td class="text-end"><button class="btn btn-sm btn-outline-dark me-1" (click)="m = { ...c }">Edit</button>
            @if (api.isAdmin) { <button class="btn btn-sm btn-outline-danger" (click)="del(c)">Delete</button> }</td></tr>
        } @empty { <tr><td colspan="4" class="text-center text-secondary py-4">No clients yet. Add the first one on the left.</td></tr> }
      </tbody></table>
    </div>
  </div>`
})
export class Clients implements OnInit {
  api = inject(Api); rows = signal<Client[]>([]); err = signal(''); q = ''; m: Partial<Client> = {};
  ngOnInit() { this.load(); }
  load() { this.api.clients(this.q).subscribe(r => this.rows.set(r)); }
  save() { this.api.saveClient(this.m).subscribe({ next: () => { this.m = {}; this.err.set(''); this.load(); }, error: e => this.err.set(msg(e)) }); }
  del(c: Client) { if (confirm(`Delete ${c.name}?`)) this.api.removeClient(c.id).subscribe({ next: () => this.load(), error: e => alert(msg(e)) }); }
}
