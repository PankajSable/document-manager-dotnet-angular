import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Api, Client, DOC_TYPES, msg } from '../core/api';

@Component({
  imports: [FormsModule, RouterLink],
  template: `
  <h1 class="h4 mb-3">{{ id ? 'Edit document' : 'Add document' }}</h1>
  <form class="row g-3" (ngSubmit)="save()" style="max-width:820px">
    <div class="col-md-6"><label class="form-label">Client *</label>
      <select class="form-select" name="c" [(ngModel)]="m.clientId" required>
        <option [ngValue]="null">Select client…</option>
        @for (c of clients(); track c.id) { <option [ngValue]="c.id">{{ c.name }}</option> }
      </select>
      <a routerLink="/clients" class="small">Client not listed? Add one</a></div>
    <div class="col-md-6"><label class="form-label">Document ID *</label><input class="form-control" name="d" [(ngModel)]="m.documentId" required></div>
    <div class="col-md-6"><label class="form-label">Document type</label>
      <select class="form-select" name="t" [(ngModel)]="m.documentType"><option value="">Select…</option>@for (t of types; track t) { <option>{{ t }}</option> }</select></div>
    <div class="col-md-6"><label class="form-label">Expiry / renewal date</label><input class="form-control" type="date" name="e" [(ngModel)]="m.expiryDate"></div>
    <div class="col-12"><label class="form-label">Property address</label><input class="form-control" name="a" [(ngModel)]="m.propertyAddress"></div>
    <div class="col-12"><label class="form-label">{{ id ? 'Replace file (leave empty to keep: ' + current() + ')' : 'File (PDF, image, Word) *' }}</label>
      <input class="form-control" type="file" (change)="pick($event)" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"></div>
    <div class="col-12"><label class="form-label">Notes</label><textarea class="form-control" rows="3" name="no" [(ngModel)]="m.notes"></textarea></div>
    @if (err()) { <div class="col-12"><div class="alert alert-danger py-2 mb-0">{{ err() }}</div></div> }
    <div class="col-12"><button class="btn btn-dark" [disabled]="busy()">Save document</button></div>
  </form>`
})
export class DocForm implements OnInit {
  private api = inject(Api); private r = inject(Router); private route = inject(ActivatedRoute);
  types = DOC_TYPES; clients = signal<Client[]>([]); current = signal(''); err = signal(''); busy = signal(false);
  id = Number(this.route.snapshot.paramMap.get('id')) || 0; file?: File;
  m: any = { clientId: null, documentId: '', documentType: '', propertyAddress: '', expiryDate: '', notes: '' };
  ngOnInit() {
    this.api.clients().subscribe(c => this.clients.set(c));
    const cid = Number(this.route.snapshot.queryParamMap.get('clientId')); if (cid) this.m.clientId = cid;
    if (this.id) this.api.getDoc(this.id).subscribe(d => {
      this.current.set(d.fileName);
      this.m = { clientId: d.clientId, documentId: d.documentId, documentType: d.documentType ?? '', propertyAddress: d.propertyAddress ?? '', expiryDate: d.expiryDate?.slice(0, 10) ?? '', notes: d.notes ?? '' };
    });
  }
  pick(e: Event) { this.file = (e.target as HTMLInputElement).files?.[0]; }
  save() {
    if (!this.m.clientId || !this.m.documentId || (!this.id && !this.file)) { this.err.set('Client, document ID and a file are required.'); return; }
    const fd = new FormData();
    Object.entries(this.m).forEach(([k, v]) => fd.append(k, (v as string) ?? ''));
    if (this.file) fd.append('file', this.file);
    this.busy.set(true); this.err.set('');
    const req = this.id ? this.api.updateDoc(this.id, fd) : this.api.createDoc(fd);
    req.subscribe({ next: r => this.r.navigate(['/view', r.id]), error: e => { this.err.set(msg(e)); this.busy.set(false); } });
  }
}
