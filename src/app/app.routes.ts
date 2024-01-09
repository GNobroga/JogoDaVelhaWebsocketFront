import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { redirectGuard } from './guards/redirect.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo:
    'account',
    pathMatch: 'full',
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account.component'),
    canActivate: [redirectGuard]
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/account/forgot-password/forgot-password.component'),
    canActivate: [redirectGuard]
  },
  {
    path: 'game',
    loadComponent: () => import('./pages/game/game.component'),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component'),
  }
];
