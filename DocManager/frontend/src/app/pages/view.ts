import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Api, Doc, saveBlob } from '../core/api';

@Component({
  imports: [DatePipe, RouterLink],
  template: `
  @if (d(); as d) {
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div><h1 class="h4 mb-0">{{ d.documentId }}</h1><a [routerLink]="['/clients', d.clientId]">{{ d.clientName }}</a></div>
      <div>
        <button class="btn btn-dark me-2" (click)="dl()">Download</button>
        <a class="btn btn-outline-dark me-2" [routerLink]="['/docs', d.id, 'edit']">Edit / replace file</a>
        @if (api.isAdmin) { <button class="btn btn-outline-danger" (click)="del()">Delete</button> }
      </div>
    </div>
    <div class="row g-4">
      <div class="col-lg-4"><dl class="row small">
        <dt class="col-5">Type</dt><dd class="col-7">{{ d.documentType || '-' }}</dd>
        <dt class="col-5">Phone</dt><dd class="col-7">{{ d.phone || '-' }}</dd>
        <dt class="col-5">Property</dt><dd class="col-7">{{ d.propertyAddress || '-' }}</dd>
        <dt class="col-5">Expires</dt><dd class="col-7">{{ d.expiryDate ? (d.expiryDate | date:'dd MMM yyyy') : '-' }}</dd>
        <dt class="col-5">Created</dt><dd class="col-7">{{ d.createdAt | date:'dd MMM yyyy, HH:mm' }} by {{ d.createdBy }}</dd>
        <dt class="col-5">Last edited</dt><dd class="col-7">{{ d.updatedAt ? (d.updatedAt | date:'dd MMM yyyy, HH:mm') : '-' }}</dd>
        <dt class="col-5">File</dt><dd class="col-7">{{ d.fileName }} ({{ (d.fileSize/1024).toFixed(0) }} KB)</dd>
        <dt class="col-5">Notes</dt><dd class="col-7">{{ d.notes || '-' }}</dd></dl></div>
      <div class="col-lg-8">
        @if (url(); as u) {
          @if (d.contentType.startsWith('image/')) { <img [src]="u" class="img-fluid border"> }
          @else if (d.contentType === 'application/pdf') { <iframe [src]="u" class="w-100 border" style="height:75vh"></iframe> }
          @else { <div class="alert alert-secondary">Preview isn’t available for this file type. Use Download to open it.</div> }
        }
      </div>
    </div>
  }`
})
export class View implements OnInit {
  api = inject(Api); private route = inject(ActivatedRoute); private san = inject(DomSanitizer); private r = inject(Router);
  d = signal<Doc | null>(null); url = signal<SafeResourceUrl | null>(null); private blob?: Blob;
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getDoc(id).subscribe({ next: d => this.d.set(d), error: () => this.r.navigate(['/search']) });
    this.api.file(id).subscribe(b => { this.blob = b; this.url.set(this.san.bypassSecurityTrustResourceUrl(URL.createObjectURL(b))); });
  }
  dl() { if (this.blob) saveBlob(this.blob, this.d()!.fileName); }
  del() { if (confirm('Delete this document permanently?')) this.api.removeDoc(this.d()!.id).subscribe(() => this.r.navigate(['/search'])); }
}
