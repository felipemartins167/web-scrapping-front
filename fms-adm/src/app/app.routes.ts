import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'sidebar',
    loadChildren: () => import('./pages/sidebar/sidebar.module').then(m => m.SidebarModule),
  },
  {
    path: 'login/admin',
    component: LoginComponent
  }
];
