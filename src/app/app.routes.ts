import { Routes } from '@angular/router';

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
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/account/forgot-password/forgot-password.component'),
  },
  {
    path: 'game',
    loadComponent: () => import('./pages/game/game.component'),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component'),
  }
];
