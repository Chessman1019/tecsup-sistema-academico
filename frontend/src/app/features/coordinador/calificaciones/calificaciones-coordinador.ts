import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoordinadorService } from '../dashboard/services/coordinador.service';
import { CalificacionDocenteService } from '../../docente/calificaciones/services/calificacion-docente.service';
import { Curso } from '../dashboard/models/coordinador.model';
import { Evaluacion } from '../../docente/calificaciones/models/evaluacion.model';

interface EvaluacionConCurso extends Evaluacion {}

@Component({
  selector: 'app-calificaciones-coordinador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calificaciones-coordinador.html',
  styleUrl: './calificaciones-coordinador.css'
})
export class CalificacionesCoordinador implements OnInit {

  cursos = signal<Curso[]>([]);
  evaluaciones = signal<EvaluacionConCurso[]>([]);

  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  constructor(
    private coordinadorService: CoordinadorService,
    private calificacionDocenteService: CalificacionDocenteService
  ) {}

  ngOnInit(): void {
    this.cargarEvaluaciones();
  }

  private cargarEvaluaciones(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.coordinadorService.listarTodosLosCursos().subscribe({
      next: (cursos) => {
        this.cursos.set(cursos);

        if (cursos.length === 0) {
          this.evaluaciones.set([]);
          this.cargando.set(false);
          return;
        }

        let completados = 0;
        const todasLasEvaluaciones: EvaluacionConCurso[] = [];

        cursos.forEach(curso => {
          this.calificacionDocenteService.listarEvaluacionesPorCurso(curso.idCurso).subscribe({
            next: (evaluaciones) => {
              todasLasEvaluaciones.push(...evaluaciones);
              completados++;
              if (completados === cursos.length) {
                this.evaluaciones.set(todasLasEvaluaciones);
                this.cargando.set(false);
              }
            },
            error: () => {
              completados++;
              if (completados === cursos.length) {
                this.evaluaciones.set(todasLasEvaluaciones);
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
}