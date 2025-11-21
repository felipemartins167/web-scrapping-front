import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';

const routes: Routes = [
  {
    path: '',
    component: SidebarComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'users',
        loadChildren: () => import('../sidebar/users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../sidebar/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'products',
        loadChildren: () => import('../sidebar/products/products.module').then(m => m.ProductsModule),
      },
      {
        path: 'plans',
        loadChildren: () => import('../sidebar/plans/plans.module').then(m => m.PlansModule),
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SidebarRoutingModule { }
