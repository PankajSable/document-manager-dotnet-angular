import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, AppUser, msg } from '../core/api';

@Component({
  imports: [FormsModule],
  template: `
  <h1 class="h4 mb-3">Users</h1>
  <div class="row g-4">
    <div class="col-lg-4"><form class="border rounded p-3" (ngSubmit)="add()">
      <h2 class="h6">New user</h2>
      <input class="form-control mb-2" placeholder="Username" name="u" [(ngModel)]="n.username" required>
      <input class="form-control mb-2" type="password" placeholder="Password (6+ characters)" name="p" [(ngModel)]="n.password" required>
      <select class="form-select mb-2" name="r" [(ngModel)]="n.role"><option>Staff</option><option>Admin</option></select>
      @if (err()) { <div class="alert alert-danger py-2">{{ err() }}</div> }
      <button class="btn btn-dark btn-sm">Add user</button></form>
      <p class="small text-secondary mt-2">Staff can add, view and edit documents. Admins can also delete documents and clients and manage users.</p></div>
    <div class="col-lg-8"><table class="table align-middle"><thead><tr><th>Username</th><th>Role</th><th>Status</th><th></th></tr></thead><tbody>
      @for (u of rows(); track u.id) {
        <tr><td>{{ u.username }}</td>
        <td><select class="form-select form-select-sm w-auto" [ngModel]="u.role" (ngModelChange)="upd(u, { role: $event })"><option>Staff</option><option>Admin</option></select></td>
        <td><span class="badge" [class]="u.isActive ? 'text-bg-success' : 'text-bg-secondary'">{{ u.isActive ? 'Active' : 'Inactive' }}</span></td>
        <td class="text-end text-nowrap"><button class="btn btn-sm btn-outline-dark me-1" (click)="upd(u, { isActive: !u.isActive })">{{ u.isActive ? 'Deactivate' : 'Activate' }}</button>
          <button class="btn btn-sm btn-outline-dark" (click)="reset(u)">Reset password</button></td></tr>
      }</tbody></table></div>
  </div>`
})
export class Users implements OnInit {
  private api = inject(Api); rows = signal<AppUser[]>([]); err = signal(''); n = { username: '', password: '', role: 'Staff' };
  ngOnInit() { this.load(); }
  load() { this.api.users().subscribe(r => this.rows.set(r)); }
  add() { this.api.addUser(this.n).subscribe({ next: () => { this.n = { username: '', password: '', role: 'Staff' }; this.err.set(''); this.load(); }, error: e => this.err.set(msg(e)) }); }
  upd(u: AppUser, ch: Partial<AppUser>) {
    this.api.updateUser(u.id, { role: u.role, isActive: u.isActive, ...ch }).subscribe({ next: () => this.load(), error: e => { alert(msg(e)); this.load(); } });
  }
  reset(u: AppUser) { const p = prompt(`New password for ${u.username} (6+ characters)`); if (p && p.length >= 6) this.upd(u, { password: p } as any); }
}
