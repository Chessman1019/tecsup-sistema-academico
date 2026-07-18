import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoordinadorService } from '../../coordinador/dashboard/services/coordinador.service';
import { CalificacionDocenteService } from '../../docente/calificaciones/services/calificacion-docente.service';

interface EstadisticaCurso {
  nombreCurso: string;
  totalEvaluaciones: number;
  pesoTotal: number;
}

@Component({
  selector: 'app-estadisticas-jefatura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas-jefatura.html',
  styleUrl: './estadisticas-jefatura.css'
})
export class EstadisticasJefatura implements OnInit {

  estadisticas = signal<EstadisticaCurso[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  constructor(
    private coordinadorService: CoordinadorService,
    private calificacionDocenteService: CalificacionDocenteService
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  private cargarEstadisticas(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.coordinadorService.listarTodosLosCursos().subscribe({
      next: (cursos) => {
        if (cursos.length === 0) {
          this.estadisticas.set([]);
          this.cargando.set(false);
          return;
        }

        let completados = 0;
        const resultados: EstadisticaCurso[] = [];

        cursos.forEach(curso => {
          this.calificacionDocenteService.listarEvaluacionesPorCurso(curso.idCurso).subscribe({
            next: (evaluaciones) => {
              const pesoTotal = evaluaciones.reduce((s, e) => s + Number(e.peso), 0);
              resultados.push({
                nombreCurso: curso.nombre,
                totalEvaluaciones: evaluaciones.length,
                pesoTotal
              });
              completados++;
              if (completados === cursos.length) {
                this.estadisticas.set(resultados.filter(r => r.totalEvaluaciones > 0));
                this.cargando.set(false);
              }
            },
            error: () => {
              completados++;
              if (completados === cursos.length) {
                this.estadisticas.set(resultados);
                this.cargando.set(false);
              }
            }
          });
        });
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar las estadísticas.');
        this.cargando.set(false);
      }
    });
  }

  obtenerClasePeso(peso: number): string {
    return peso === 100 ? 'badge-exito' : 'badge-advertencia';
  }
}