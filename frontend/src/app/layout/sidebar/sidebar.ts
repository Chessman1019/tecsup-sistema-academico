import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MENU_POR_ROL, OpcionMenu } from '../../core/constants/menu-roles';

const COLOR_POR_ROL: Record<string, string> = {
  ESTUDIANTE: '#0092D6',
  DOCENTE: '#1B8A5A',
  ASISTENTE_REGISTRO: '#B7791F',
  COORDINADOR_ACADEMICO: '#6B46C1',
  JEFE_GESTION_ACADEMICA: '#0A1628',
  ADMIN: '#0A1628'
};

const ETIQUETA_ROL: Record<string, string> = {
  ESTUDIANTE: 'Estudiante',
  DOCENTE: 'Docente',
  ASISTENTE_REGISTRO: 'Asistente',
  COORDINADOR_ACADEMICO: 'Coordinador',
  JEFE_GESTION_ACADEMICA: 'Jefatura',
  ADMIN: 'Administrador'
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  @Input() abierto = false;
  @Output() cerrar = new EventEmitter<void>();

  constructor(public authService: AuthService) {}

  opcionesVisibles = computed<OpcionMenu[]>(() => {
    const usuario = this.authService.currentUser();
    if (!usuario) return [];
    return MENU_POR_ROL[usuario.rol] ?? [];
  });

  colorRol = computed(() => {
    const usuario = this.authService.currentUser();
    return usuario ? (COLOR_POR_ROL[usuario.rol] ?? '#0092D6') : '#0092D6';
  });

  etiquetaRol = computed(() => {
    const usuario = this.authService.currentUser();
    return usuario ? (ETIQUETA_ROL[usuario.rol] ?? usuario.rol) : '';
  });

  inicialUsuario = computed(() => {
    const usuario = this.authService.currentUser();
    return usuario ? usuario.username.charAt(0).toUpperCase() : '?';
  });

  onLinkClick(): void {
    this.cerrar.emit();
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}