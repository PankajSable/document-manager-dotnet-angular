import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { ClientDetail } from '../../models/models';

@Component({ selector: 'app-client-detail', imports: [RouterLink, DatePipe], templateUrl: './client-detail.component.html' })
export class ClientDetailComponent implements OnInit {
  client = signal<ClientDetail | null>(null);

  constructor(private clientService: ClientService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.clientService.getById(id).subscribe(c => this.client.set(c));
  }
}
