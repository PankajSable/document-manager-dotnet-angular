import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { ClientService } from '../../services/client.service';
import { Client, DOCUMENT_TYPES } from '../../models/models';
import { errorMessage } from '../../helpers/helpers';

@Component({ selector: 'app-document-form', imports: [FormsModule, RouterLink], templateUrl: './document-form.component.html' })
export class DocumentFormComponent implements OnInit {
  types = DOCUMENT_TYPES;
  clients = signal<Client[]>([]);
  currentFile = signal('');
  documentId = signal('');
  error = signal('');
  busy = signal(false);
  id = 0;
  file?: File;
  model: any = { clientId: null,  documentType: '', propertyAddress: '', expiryDate: '', notes: '' };

  constructor(private documentService: DocumentService, private clientService: ClientService,
              private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.clientService.getAll().subscribe(c => this.clients.set(c));

    const clientId = Number(this.route.snapshot.queryParamMap.get('clientId'));
    if (clientId) this.model.clientId = clientId;

    if (this.id) {
      this.documentService.getById(this.id).subscribe(d => {
        this.currentFile.set(d.fileName);
        this.documentId.set(d.documentId);
        this.model = {
          clientId: d.clientId,  documentType: d.documentType ?? '',
          propertyAddress: d.propertyAddress ?? '', expiryDate: d.expiryDate?.slice(0, 10) ?? '', notes: d.notes ?? ''
        };
      });
    }
  }

  onFileSelected(e: Event) { this.file = (e.target as HTMLInputElement).files?.[0]; }

  save() {
    if (!this.model.clientId ||  (!this.id && !this.file) || this.model.documentType === '') {
      this.error.set('Client, document type, and a file are required.');
      return;
    }
    const form = new FormData();
    Object.entries(this.model).forEach(([k, v]) => form.append(k, (v as string) ?? ''));
    if (this.file) form.append('file', this.file);

    this.busy.set(true);
    this.error.set('');
    const request = this.id ? this.documentService.update(this.id, form) : this.documentService.create(form);
    request.subscribe({
      next: r => this.router.navigate(['/view', r.id]),
      error: e => { this.error.set(errorMessage(e)); this.busy.set(false); }
    });
  }
}
