import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AppUser, CreateUser } from '../../models/models';
import { errorMessage } from '../../helpers/helpers';

@Component({ selector: 'app-users', imports: [FormsModule], templateUrl: './users.component.html' })
export class UsersComponent implements OnInit {
  users = signal<AppUser[]>([]);
  error = signal('');
  model: CreateUser = { username: '', password: '', role: 'Staff' };

  constructor(private userService: UserService) {}

  ngOnInit() { this.load(); }

  load() { this.userService.getAll().subscribe(u => this.users.set(u)); }

  add() {
    this.userService.create(this.model).subscribe({
      next: () => { this.model = { username: '', password: '', role: 'Staff' }; this.error.set(''); this.load(); },
      error: e => this.error.set(errorMessage(e))
    });
  }

  changeRole(u: AppUser, role: string) { this.update(u, { role }); }
  toggleActive(u: AppUser) { this.update(u, { isActive: !u.isActive }); }

  resetPassword(u: AppUser) {
    const password = prompt(`New password for ${u.username} (6+ characters)`);
    if (password && password.length >= 6) this.update(u, { password });
  }

  private update(u: AppUser, change: { role?: string; isActive?: boolean; password?: string }) {
    this.userService.update(u.id, { role: u.role, isActive: u.isActive, ...change }).subscribe({
      next: () => this.load(),
      error: e => { alert(errorMessage(e)); this.load(); }
    });
  }
}
