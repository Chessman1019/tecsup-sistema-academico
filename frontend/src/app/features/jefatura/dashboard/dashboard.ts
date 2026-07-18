import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CoordinadorService } from '../../coordinador/dashboard/services/coordinador.service';
import { AsistenteService } from '../../asistente/dashboard/services/asistente.service';
import { MatriculaAdminService } from '../../asistente/matriculas/services/matricula-admin.service';

interface AccesoRapido {
  etiqueta: string;
  descripcion: string;
  ruta: string;
  icono: string;
}

@Component({
  selector: 'app-dashboard-jefatura',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardJefatura implements OnInit {

  totalDocentes = signal(0);
  totalEstudiantes = signal(0);
  totalMatriculasActivas = signal(0);
  cargando = signal(false);

  accesosRapidos: AccesoRapido[] = [
    { etiqueta: 'Indicadores', descripcion: 'Panorama institucional', ruta: '/app/jefatura/indicadores', icono: '📈' },
    { etiqueta: 'Docentes', descripcion: 'Consulta el staff docente', ruta: '/app/jefatura/docentes', icono: '🧑‍🏫' },
    { etiqueta: 'Estudiantes', descripcion: 'Consulta estudiantes', ruta: '/app/jefatura/estudiantes', icono: '👥' },
    { etiqueta: 'Reportes', descripcion: 'Reportes consolidados', ruta: '/app/jefatura/reportes', icono: '📊' },
    { etiqueta: 'Aprobaciones', descripcion: 'Gestiona solicitudes pendientes', ruta: '/app/jefatura/aprobaciones', icono: '✅' },
    { etiqueta: 'Estadísticas', descripcion: 'Análisis de desempeño', ruta: '/app/jefatura/estadisticas', icono: '📉' }
  ];

  constructor(
    public authService: AuthService,
    private coordinadorService: CoordinadorService,
    private asistenteService: AsistenteService,
    private matriculaAdminService: MatriculaAdminService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando.set(true);

    this.coordinadorService.listarTodosLosDocentes().subscribe({
      next: (docentes) => this.totalDocentes.set(docentes.length)
    });

    this.asistenteService.listarTodosLosEstudiantes().subscribe({
      next: (estudiantes) => this.totalEstudiantes.set(estudiantes.length)
    });

    this.matriculaAdminService.listarTodasLasMatriculas().subscribe({
      next: (matriculas) => {
        this.totalMatriculasActivas.set(matriculas.filter(m => m.estado === 'Activo').length);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}