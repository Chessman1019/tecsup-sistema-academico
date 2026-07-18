import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { CalificacionService } from './services/calificacion.service';
import { MatriculaService } from '../matricula/services/matricula.service';
import { CursoConNotas } from './models/calificacion.model';

@Component({
  selector: 'app-calificaciones-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calificaciones-page.html',
  styleUrl: './calificaciones-page.css'
})
export class CalificacionesPage implements OnInit {

  cursosConNotas = signal<CursoConNotas[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  constructor(
    private calificacionService: CalificacionService,
    private matriculaService: MatriculaService
  ) {}

  ngOnInit(): void {
    this.cargarCalificaciones();
  }

  private cargarCalificaciones(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.matriculaService.obtenerMiPerfil().subscribe({
      next: (estudiante) => {
        this.matriculaService.listarMisMatriculas(estudiante.idEstudiante).subscribe({
          next: (matriculas) => {
            const matriculasActivas = matriculas.filter(m => m.estado === 'Activo' || m.estado === 'Aprobado');

            if (matriculasActivas.length === 0) {
              this.cursosConNotas.set([]);
              this.cargando.set(false);
              return;
            }

            const peticiones = matriculasActivas.map(m =>
              forkJoin({
                notas: this.calificacionService.listarPorMatricula(m.idMatricula),
                promedio: this.calificacionService.obtenerPromedio(m.idMatricula)
              })
            );

            forkJoin(peticiones).subscribe({
              next: (resultados) => {
                const cursos: CursoConNotas[] = matriculasActivas.map((m, i) => ({
                  idMatricula: m.idMatricula,
                  codigoCurso: m.codigoCurso,
                  nombreCurso: m.nombreCurso,
                  calificaciones: resultados[i].notas,
                  promedio: resultados[i].promedio,
                  cargando: false
                }));
                this.cursosConNotas.set(cursos);
                this.cargando.set(false);
              },
              error: () => {
                this.mensajeError.set('No se pudieron cargar las calificaciones.');
                this.cargando.set(false);
              }
            });
          },
          error: () => {
            this.mensajeError.set('No se pudieron cargar tus matrículas.');
            this.cargando.set(false);
          }
        });
      },
      error: () => {
        this.mensajeError.set('No se pudo cargar tu perfil de estudiante.');
        this.cargando.set(false);
      }
    });
  }

  obtenerColorPromedio(promedio: number): string {
    if (promedio >= 14) return 'promedio-alto';
    if (promedio >= 12) return 'promedio-medio';
    return 'promedio-bajo';
  }

  obtenerClaseNota(nota: number): string {
    return nota >= 12 ? 'badge-exito' : 'badge-peligro';
  }
}