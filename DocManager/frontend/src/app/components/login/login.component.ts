import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({ selector: 'app-login', imports: [FormsModule], templateUrl: './login.component.html' })
export class LoginComponent {
  username = '';
  password = '';
  error = signal('');
  busy = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.busy.set(true);
    this.error.set('');
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => { this.error.set('Wrong username or password, or the account is inactive.'); this.busy.set(false); }
    });
  }
}
