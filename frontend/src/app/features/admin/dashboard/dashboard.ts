import { Component, OnInit, signal } from '@angular/core';
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
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardAdmin implements OnInit {

  totalDocentes = signal(0);
  totalEstudiantes = signal(0);
  totalMatriculas = signal(0);
  cargando = signal(false);

  accesosRapidos: AccesoRapido[] = [
    { etiqueta: 'Usuarios', descripcion: 'Gestiona cuentas del sistema', ruta: '/app/admin/usuarios', icono: '👤' },
    { etiqueta: 'Cursos', descripcion: 'Administra el catálogo académico', ruta: '/app/admin/cursos', icono: '📚' },
    { etiqueta: 'Docentes', descripcion: 'Consulta el staff docente', ruta: '/app/admin/docentes', icono: '🧑‍🏫' },
    { etiqueta: 'Estudiantes', descripcion: 'Consulta estudiantes', ruta: '/app/admin/estudiantes', icono: '👥' },
    { etiqueta: 'Horarios', descripcion: 'Gestiona horarios y aulas', ruta: '/app/admin/horarios', icono: '🗓️' },
    { etiqueta: 'Reportes', descripcion: 'Indicadores generales', ruta: '/app/admin/reportes', icono: '📊' }
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
        this.totalMatriculas.set(matriculas.length);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}