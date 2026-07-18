import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CoordinadorService } from './services/coordinador.service';
import { DocenteListado, Curso } from './models/coordinador.model';

interface AccesoRapido {
  etiqueta: string;
  descripcion: string;
  ruta: string;
  icono: string;
}

@Component({
  selector: 'app-dashboard-coordinador',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardCoordinador implements OnInit {

  docentes = signal<DocenteListado[]>([]);
  cursos = signal<Curso[]>([]);
  cargando = signal(false);

  totalDocentes = computed(() => this.docentes().length);
  totalCursos = computed(() => this.cursos().length);
  cursosActivos = computed(() => this.cursos().filter(c => c.estado).length);

  accesosRapidos: AccesoRapido[] = [
    { etiqueta: 'Docentes', descripcion: 'Consulta el staff docente', ruta: '/app/coordinador/docentes', icono: '🧑‍🏫' },
    { etiqueta: 'Estudiantes', descripcion: 'Consulta estudiantes', ruta: '/app/coordinador/estudiantes', icono: '👥' },
    { etiqueta: 'Horarios', descripcion: 'Gestiona horarios y aulas', ruta: '/app/coordinador/horarios', icono: '🗓️' },
    { etiqueta: 'Matrículas', descripcion: 'Supervisa inscripciones', ruta: '/app/coordinador/matriculas', icono: '📋' },
    { etiqueta: 'Reportes', descripcion: 'Indicadores académicos', ruta: '/app/coordinador/reportes', icono: '📊' },
    { etiqueta: 'Incidencias', descripcion: 'Gestiona incidencias', ruta: '/app/coordinador/incidencias', icono: '⚠️' }
  ];

  constructor(
    public authService: AuthService,
    private coordinadorService: CoordinadorService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando.set(true);

    this.coordinadorService.listarTodosLosDocentes().subscribe({
      next: (docentes) => this.docentes.set(docentes)
    });

    this.coordinadorService.listarTodosLosCursos().subscribe({
      next: (cursos) => {
        this.cursos.set(cursos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}