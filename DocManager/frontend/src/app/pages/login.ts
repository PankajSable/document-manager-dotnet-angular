import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../core/api';

@Component({
  imports: [FormsModule],
  template: `
  <div class="mx-auto" style="max-width:380px;margin-top:10vh">
    <h1 class="h3 mb-1">Document Manager</h1>
    <p class="text-secondary mb-4">Sign in to manage client documents.</p>
    <form (ngSubmit)="go()">
      <div class="mb-3"><label class="form-label">Username</label><input class="form-control" name="u" [(ngModel)]="u" required autofocus></div>
      <div class="mb-3"><label class="form-label">Password</label><input class="form-control" type="password" name="p" [(ngModel)]="p" required></div>
      @if (err()) { <div class="alert alert-danger py-2">{{ err() }}</div> }
      <button class="btn btn-dark w-100" [disabled]="busy()">Sign in</button>
    </form>
  </div>`
})
export class Login {
  private api = inject(Api); private r = inject(Router);
  u = ''; p = ''; err = signal(''); busy = signal(false);
  go() {
    this.busy.set(true); this.err.set('');
    this.api.login(this.u, this.p).subscribe({
      next: () => this.r.navigate(['/dashboard']),
      error: () => { this.err.set('Wrong username or password, or the account is inactive.'); this.busy.set(false); }
    });
  }
}
