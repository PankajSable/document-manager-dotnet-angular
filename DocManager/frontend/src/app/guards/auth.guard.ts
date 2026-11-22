import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () =>
  inject(AuthService).token ? true : inject(Router).parseUrl('/login');

export const adminGuard: CanActivateFn = () =>
  inject(AuthService).isAdmin ? true : inject(Router).parseUrl('/dashboard');
