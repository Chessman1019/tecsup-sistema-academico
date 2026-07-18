import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorarioAdminService } from '../horarios/services/horario-admin.service';
import { MatriculaAdminService } from '../../asistente/matriculas/services/matricula-admin.service';
import { HorarioAdmin } from '../horarios/models/horario-admin.model';

interface ResumenAsistenciaCurso {
  idHorario: string;
  nombreCurso: string;
  nombreDocente: string;
  totalEstudiantes: number;
}

@Component({
  selector: 'app-asistencia-coordinador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asistencia-coordinador.html',
  styleUrl: './asistencia-coordinador.css'
})
export class AsistenciaCoordinador implements OnInit {

  resumenes = signal<ResumenAsistenciaCurso[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  constructor(
    private horarioAdminService: HorarioAdminService,
    private matriculaAdminService: MatriculaAdminService
  ) {}

  ngOnInit(): void {
    this.cargarResumen();
  }

  private cargarResumen(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.horarioAdminService.listarTodos().subscribe({
      next: (horarios) => {
        if (horarios.length === 0) {
          this.resumenes.set([]);
          this.cargando.set(false);
          return;
        }

        let completados = 0;
        const resultados: ResumenAsistenciaCurso[] = [];

        horarios.forEach((h: HorarioAdmin) => {
          this.matriculaAdminService.listarTodasLasMatriculas().subscribe({
            next: () => {
              // Contamos matriculas activas para este horario especifico
              this.contarEstudiantesPorHorario(h, (total) => {
                resultados.push({
                  idHorario: h.idHorario,
                  nombreCurso: h.nombreCurso,
                  nombreDocente: h.nombreDocente,
                  totalEstudiantes: total
                });
                completados++;
                if (completados === horarios.length) {
                  this.resumenes.set(resultados);
                  this.cargando.set(false);
                }
              });
            },
            error: () => {
              completados++;
              if (completados === horarios.length) {
                this.cargando.set(false);
              }
            }
          });
        });
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los cursos.');
        this.cargando.set(false);
      }
    });
  }

  private contarEstudiantesPorHorario(horario: HorarioAdmin, callback: (total: number) => void): void {
    this.matriculaAdminService.listarTodasLasMatriculas().subscribe({
      next: (matriculas) => {
        const total = matriculas.filter(m =>
          m.nombreCurso === horario.nombreCurso && m.estado === 'Activo'
        ).length;
        callback(total);
      },
      error: () => callback(0)
    });
  }
}