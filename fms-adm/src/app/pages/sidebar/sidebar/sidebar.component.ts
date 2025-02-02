import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Ripple } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { StyleClass } from 'primeng/styleclass';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, Ripple, InputTextModule, StyleClass],
  providers: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  constructor() {}
  
  ngOnInit(): void {
    
  }
}
