import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarRoutingModule } from './sidebar-routing.module';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SidebarRoutingModule
  ],
  providers: [
    provideRouter(routes)
  ]
})
export class SidebarModule { }
