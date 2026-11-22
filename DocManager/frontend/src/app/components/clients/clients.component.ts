import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../services/auth.service';
import { Client } from '../../models/models';
import { errorMessage } from '../../helpers/helpers';

@Component({ selector: 'app-clients', imports: [FormsModule, RouterLink], templateUrl: './clients.component.html' })
export class ClientsComponent implements OnInit {
  clients = signal<Client[]>([]);
  error = signal('');
  search = '';
  model: Client = { name: '' };

  constructor(private clientService: ClientService, public auth: AuthService) {}

  ngOnInit() { this.load(); }

  load() { this.clientService.getAll(this.search).subscribe(c => this.clients.set(c)); }

  edit(c: Client) { this.model = { ...c }; }
  cancel() { this.model = { name: '' }; }

  save() {
    this.clientService.save(this.model).subscribe({
      next: () => { this.cancel(); this.error.set(''); this.load(); },
      error: e => this.error.set(errorMessage(e))
    });
  }

  delete(c: Client) {
    if (!confirm(`Delete ${c.name}?`)) return;
    this.clientService.delete(c.id!).subscribe({ next: () => this.load(), error: e => alert(errorMessage(e)) });
  }
}
