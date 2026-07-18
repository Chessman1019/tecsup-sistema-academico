import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

  sidebarAbierto = signal(false);

  toggleSidebar(): void {
    this.sidebarAbierto.update(valor => !valor);
  }

  cerrarSidebar(): void {
    this.sidebarAbierto.set(false);
  }
}