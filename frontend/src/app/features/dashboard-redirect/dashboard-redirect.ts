import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

const RUTA_POR_ROL: Record<string, string> = {
  ADMIN: '/app/admin/dashboard',
  ESTUDIANTE: '/app/estudiante/dashboard',
  DOCENTE: '/app/docente/dashboard',
  ASISTENTE_REGISTRO: '/app/asistente/dashboard',
  COORDINADOR_ACADEMICO: '/app/coordinador/dashboard',
  JEFE_GESTION_ACADEMICA: '/app/jefatura/dashboard'
};

@Component({
  selector: 'app-dashboard-redirect',
  standalone: true,
  template: ''
})
export class DashboardRedirect implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.currentUser();
    const ruta = usuario ? (RUTA_POR_ROL[usuario.rol] ?? '/login') : '/login';
    this.router.navigate([ruta]);
  }
}