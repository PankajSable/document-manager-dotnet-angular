import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentService } from '../../services/document.service';
import { AuthService } from '../../services/auth.service';
import { Document } from '../../models/models';
import { saveBlob } from '../../helpers/helpers';

@Component({ selector: 'app-document-view', imports: [RouterLink, DatePipe], templateUrl: './document-view.component.html' })
export class DocumentViewComponent implements OnInit {
  doc = signal<Document | null>(null);
  previewUrl = signal<SafeResourceUrl | null>(null);
  private blob?: Blob;

  constructor(private documentService: DocumentService, public auth: AuthService,
              private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.documentService.getById(id).subscribe({
      next: d => this.doc.set(d),
      error: () => this.router.navigate(['/search'])
    });
    this.documentService.getFile(id).subscribe(b => {
      this.blob = b;
      this.previewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(b)));
    });
  }

  download() { if (this.blob) saveBlob(this.blob, this.doc()!.fileName); }

  delete() {
    if (!confirm('Delete this document permanently?')) return;
    this.documentService.delete(this.doc()!.id).subscribe(() => this.router.navigate(['/search']));
  }
}
