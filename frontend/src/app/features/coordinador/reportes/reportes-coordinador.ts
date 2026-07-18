import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoordinadorService } from '../dashboard/services/coordinador.service';
import { HorarioAdminService } from '../horarios/services/horario-admin.service';
import { MatriculaAdminService } from '../../asistente/matriculas/services/matricula-admin.service';
import { AsistenteService } from '../../asistente/dashboard/services/asistente.service';

@Component({
  selector: 'app-reportes-coordinador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes-coordinador.html',
  styleUrl: './reportes-coordinador.css'
})
export class ReportesCoordinador implements OnInit {

  totalDocentes = signal(0);
  totalCursos = signal(0);
  cursosActivos = signal(0);
  totalHorarios = signal(0);
  totalEstudiantes = signal(0);
  totalMatriculas = signal(0);
  matriculasActivas = signal(0);

  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  porcentajeCursosActivos = computed(() => {
    const total = this.totalCursos();
    return total === 0 ? 0 : Math.round((this.cursosActivos() / total) * 100);
  });

  constructor(
    private coordinadorService: CoordinadorService,
    private horarioAdminService: HorarioAdminService,
    private matriculaAdminService: MatriculaAdminService,
    private asistenteService: AsistenteService
  ) {}

  ngOnInit(): void {
    this.cargarReporte();
  }

  private cargarReporte(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.coordinadorService.listarTodosLosDocentes().subscribe({
      next: (docentes) => this.totalDocentes.set(docentes.length),
      error: () => this.mensajeError.set('No se pudo cargar el reporte de docentes.')
    });

    this.coordinadorService.listarTodosLosCursos().subscribe({
      next: (cursos) => {
        this.totalCursos.set(cursos.length);
        this.cursosActivos.set(cursos.filter(c => c.estado).length);
      },
      error: () => this.mensajeError.set('No se pudo cargar el reporte de cursos.')
    });

    this.horarioAdminService.listarTodos().subscribe({
      next: (horarios) => this.totalHorarios.set(horarios.length),
      error: () => this.mensajeError.set('No se pudo cargar el reporte de horarios.')
    });

    this.asistenteService.listarTodosLosEstudiantes().subscribe({
      next: (estudiantes) => this.totalEstudiantes.set(estudiantes.length),
      error: () => this.mensajeError.set('No se pudo cargar el reporte de estudiantes.')
    });

    this.matriculaAdminService.listarTodasLasMatriculas().subscribe({
      next: (matriculas) => {
        this.totalMatriculas.set(matriculas.length);
        this.matriculasActivas.set(matriculas.filter(m => m.estado === 'Activo').length);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudo cargar el reporte de matrículas.');
        this.cargando.set(false);
      }
    });
  }
}