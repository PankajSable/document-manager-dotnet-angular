import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { Document, DocumentSearch, DOCUMENT_TYPES } from '../../models/models';
import { saveBlob } from '../../helpers/helpers';

@Component({ selector: 'app-document-search', imports: [FormsModule, RouterLink, DatePipe], templateUrl: './document-search.component.html' })
export class DocumentSearchComponent implements OnInit {
  types = DOCUMENT_TYPES;
  documents = signal<Document[]>([]);
  loaded = signal(false);
  filter: DocumentSearch = { name: '', documentId: '', type: '', from: '', to: '' };

  constructor(private documentService: DocumentService) {}

  ngOnInit() { this.search(); }

  search() {
    this.documentService.search(this.filter).subscribe(d => { this.documents.set(d); this.loaded.set(true); });
  }

  download(d: Document) {
    this.documentService.getFile(d.id).subscribe(blob => saveBlob(blob, d.fileName));
  }
}
