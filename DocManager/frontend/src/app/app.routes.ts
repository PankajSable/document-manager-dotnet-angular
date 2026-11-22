import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientDetailComponent } from './components/client-detail/client-detail.component';
import { DocumentSearchComponent } from './components/document-search/document-search.component';
import { DocumentFormComponent } from './components/document-form/document-form.component';
import { DocumentViewComponent } from './components/document-view/document-view.component';
import { UsersComponent } from './components/users/users.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'clients', component: ClientsComponent, canActivate: [authGuard] },
  { path: 'clients/:id', component: ClientDetailComponent, canActivate: [authGuard] },
  { path: 'search', component: DocumentSearchComponent, canActivate: [authGuard] },
  { path: 'docs/new', component: DocumentFormComponent, canActivate: [authGuard] },
  { path: 'docs/:id/edit', component: DocumentFormComponent, canActivate: [authGuard] },
  { path: 'view/:id', component: DocumentViewComponent, canActivate: [authGuard] },
  { path: 'users', component: UsersComponent, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
