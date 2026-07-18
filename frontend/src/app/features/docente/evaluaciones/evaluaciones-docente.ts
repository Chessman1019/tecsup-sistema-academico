import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { DocenteService } from '../dashboard/services/docente.service';
import { CalificacionDocenteService } from '../calificaciones/services/calificacion-docente.service';
import { Evaluacion } from '../calificaciones/models/evaluacion.model';

@Component({
  selector: 'app-evaluaciones-docente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evaluaciones-docente.html',
  styleUrl: './evaluaciones-docente.css'
})
export class EvaluacionesDocente implements OnInit {

  evaluaciones = signal<Evaluacion[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  totalPesoPorCurso = computed(() => {
    const mapa = new Map<string, number>();
    for (const ev of this.evaluaciones()) {
      const actual = mapa.get(ev.nombreCurso) ?? 0;
      mapa.set(ev.nombreCurso, actual + Number(ev.peso));
    }
    return mapa;
  });

  constructor(
    private docenteService: DocenteService,
    private calificacionService: CalificacionDocenteService
  ) {}

  ngOnInit(): void {
    this.cargarEvaluaciones();
  }

  private cargarEvaluaciones(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.docenteService.obtenerMiPerfil().subscribe({
      next: (docente) => {
        this.docenteService.listarMisHorarios(docente.idDocente).subscribe({
          next: (horarios) => {
            const cursosUnicos = Array.from(new Map(horarios.map(h => [h.idCurso, h])).values());

            if (cursosUnicos.length === 0) {
              this.evaluaciones.set([]);
              this.cargando.set(false);
              return;
            }

            const peticiones = cursosUnicos.map(h =>
              this.calificacionService.listarEvaluacionesPorCurso(h.idCurso)
            );

            forkJoin(peticiones).subscribe({
              next: (resultados) => {
                this.evaluaciones.set(resultados.flat());
                this.cargando.set(false);
              },
              error: () => {
                this.mensajeError.set('No se pudieron cargar las evaluaciones.');
                this.cargando.set(false);
              }
            });
          },
          error: () => this.cargando.set(false)
        });
      },
      error: () => {
        this.mensajeError.set('No se pudo cargar tu perfil de docente.');
        this.cargando.set(false);
      }
    });
  }

  obtenerPesoTotal(nombreCurso: string): number {
    return this.totalPesoPorCurso().get(nombreCurso) ?? 0;
  }
}