import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Ripple } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { StyleClass } from 'primeng/styleclass';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, Ripple, InputTextModule, StyleClass, CommonModule],
  providers: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  isSidebarVisible: boolean = false;

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    if (this.isSidebarVisible) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }

  closeSidebar() {
    this.isSidebarVisible = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const sidebar = document.getElementById('app-sidebar-1');
    const menuToggle = document.querySelector('.menu-toggle');

    if (sidebar && !sidebar.contains(event.target as Node) && menuToggle && !menuToggle.contains(event.target as Node)) {
      this.closeSidebar();
    }
  }

  constructor() {}
  
  ngOnInit(): void {
    
  }
}
