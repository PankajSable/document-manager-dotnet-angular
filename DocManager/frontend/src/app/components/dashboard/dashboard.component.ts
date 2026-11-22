import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../models/models';
import { daysLeft } from '../../helpers/helpers';

@Component({ selector: 'app-dashboard', imports: [RouterLink, DatePipe], templateUrl: './dashboard.component.html' })
export class DashboardComponent implements OnInit {
  data = signal<Dashboard | null>(null);
  daysLeft = daysLeft;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() { this.dashboardService.get().subscribe(d => this.data.set(d)); }
}
