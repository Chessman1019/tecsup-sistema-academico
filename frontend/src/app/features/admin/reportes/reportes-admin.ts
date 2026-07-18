import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoordinadorService } from '../../coordinador/dashboard/services/coordinador.service';
import { AsistenteService } from '../../asistente/dashboard/services/asistente.service';
import { MatriculaAdminService } from '../../asistente/matriculas/services/matricula-admin.service';
import { PagoAdminService } from '../../asistente/pagos/services/pago-admin.service';
import { HorarioAdminService } from '../../coordinador/horarios/services/horario-admin.service';
import { UsuarioAdminService } from '../usuarios/services/usuario-admin.service';

@Component({
  selector: 'app-reportes-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes-admin.html',
  styleUrl: './reportes-admin.css'
})
export class ReportesAdmin implements OnInit {

  totalUsuarios = signal(0);
  usuariosActivos = signal(0);
  totalDocentes = signal(0);
  totalCursos = signal(0);
  cursosActivos = signal(0);
  totalHorarios = signal(0);
  totalEstudiantes = signal(0);
  estudiantesActivos = signal(0);
  totalMatriculas = signal(0);
  matriculasActivas = signal(0);
  totalRecaudado = signal(0);
  totalPendienteCobro = signal(0);

  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  porcentajeCursosActivos = computed(() => {
    const total = this.totalCursos();
    return total === 0 ? 0 : Math.round((this.cursosActivos() / total) * 100);
  });

  porcentajeMatriculasActivas = computed(() => {
    const total = this.totalMatriculas();
    return total === 0 ? 0 : Math.round((this.matriculasActivas() / total) * 100);
  });

  constructor(
    private coordinadorService: CoordinadorService,
    private asistenteService: AsistenteService,
    private matriculaAdminService: MatriculaAdminService,
    private pagoAdminService: PagoAdminService,
    private horarioAdminService: HorarioAdminService,
    private usuarioAdminService: UsuarioAdminService
  ) {}

  ngOnInit(): void {
    this.cargarReporte();
  }

  private cargarReporte(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.usuarioAdminService.listarTodos().subscribe({
      next: (usuarios) => {
        this.totalUsuarios.set(usuarios.length);
        this.usuariosActivos.set(usuarios.filter(u => u.estado).length);
      },
      error: () => this.mensajeError.set('No se pudo cargar el reporte de usuarios.')
    });

    this.coordinadorService.listarTodosLosDocentes().subscribe({
      next: (docentes) => this.totalDocentes.set(docentes.length)
    });

    this.coordinadorService.listarTodosLosCursos().subscribe({
      next: (cursos) => {
        this.totalCursos.set(cursos.length);
        this.cursosActivos.set(cursos.filter(c => c.estado).length);
      }
    });

    this.horarioAdminService.listarTodos().subscribe({
      next: (horarios) => this.totalHorarios.set(horarios.length)
    });

    this.asistenteService.listarTodosLosEstudiantes().subscribe({
      next: (estudiantes) => {
        this.totalEstudiantes.set(estudiantes.length);
        this.estudiantesActivos.set(estudiantes.filter(e => e.estado).length);
      }
    });

    this.matriculaAdminService.listarTodasLasMatriculas().subscribe({
      next: (matriculas) => {
        this.totalMatriculas.set(matriculas.length);
        this.matriculasActivas.set(matriculas.filter(m => m.estado === 'Activo').length);
      }
    });

    this.pagoAdminService.listarTodos().subscribe({
      next: (pagos) => {
        this.totalRecaudado.set(pagos.filter(p => p.estado === 'Pagado').reduce((s, p) => s + p.monto, 0));
        this.totalPendienteCobro.set(
          pagos.filter(p => p.estado === 'Pendiente' || p.estado === 'Vencido').reduce((s, p) => s + p.monto, 0)
        );
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudo cargar el reporte de pagos.');
        this.cargando.set(false);
      }
    });
  }
}