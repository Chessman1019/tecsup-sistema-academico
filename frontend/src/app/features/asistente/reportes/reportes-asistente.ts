import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenteService } from '../dashboard/services/asistente.service';
import { MatriculaAdminService } from '../matriculas/services/matricula-admin.service';
import { PagoAdminService } from '../pagos/services/pago-admin.service';

@Component({
  selector: 'app-reportes-asistente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes-asistente.html',
  styleUrl: './reportes-asistente.css'
})
export class ReportesAsistente implements OnInit {

  totalEstudiantes = signal(0);
  estudiantesActivos = signal(0);

  totalMatriculas = signal(0);
  matriculasActivas = signal(0);
  matriculasRetiradas = signal(0);

  totalRecaudado = signal(0);
  totalPendienteCobro = signal(0);
  pagosVencidos = signal(0);

  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  porcentajeMatriculasActivas = computed(() => {
    const total = this.totalMatriculas();
    return total === 0 ? 0 : Math.round((this.matriculasActivas() / total) * 100);
  });

  constructor(
    private asistenteService: AsistenteService,
    private matriculaAdminService: MatriculaAdminService,
    private pagoAdminService: PagoAdminService
  ) {}

  ngOnInit(): void {
    this.cargarReporte();
  }

  private cargarReporte(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.asistenteService.listarTodosLosEstudiantes().subscribe({
      next: (estudiantes) => {
        this.totalEstudiantes.set(estudiantes.length);
        this.estudiantesActivos.set(estudiantes.filter(e => e.estado).length);
      },
      error: () => this.mensajeError.set('No se pudo cargar el reporte de estudiantes.')
    });

    this.matriculaAdminService.listarTodasLasMatriculas().subscribe({
      next: (matriculas) => {
        this.totalMatriculas.set(matriculas.length);
        this.matriculasActivas.set(matriculas.filter(m => m.estado === 'Activo').length);
        this.matriculasRetiradas.set(matriculas.filter(m => m.estado === 'Retirado').length);
      },
      error: () => this.mensajeError.set('No se pudo cargar el reporte de matrículas.')
    });

    this.pagoAdminService.listarTodos().subscribe({
      next: (pagos) => {
        this.totalRecaudado.set(
          pagos.filter(p => p.estado === 'Pagado').reduce((s, p) => s + p.monto, 0)
        );
        this.totalPendienteCobro.set(
          pagos.filter(p => p.estado === 'Pendiente' || p.estado === 'Vencido').reduce((s, p) => s + p.monto, 0)
        );
        this.pagosVencidos.set(pagos.filter(p => p.estado === 'Vencido').length);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudo cargar el reporte de pagos.');
        this.cargando.set(false);
      }
    });
  }
}