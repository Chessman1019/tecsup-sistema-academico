import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AsistenciaService } from './services/asistencia.service';
import { MatriculaService } from '../matricula/services/matricula.service';
import { CursoConAsistencia } from './models/asistencia.model';

@Component({
  selector: 'app-asistencia-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asistencia-page.html',
  styleUrl: './asistencia-page.css'
})
export class AsistenciaPage implements OnInit {

  cursosConAsistencia = signal<CursoConAsistencia[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  constructor(
    private asistenciaService: AsistenciaService,
    private matriculaService: MatriculaService
  ) {}

  ngOnInit(): void {
    this.cargarAsistencia();
  }

  private cargarAsistencia(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.matriculaService.obtenerMiPerfil().subscribe({
      next: (estudiante) => {
        this.matriculaService.listarMisMatriculas(estudiante.idEstudiante).subscribe({
          next: (matriculas) => {
            const matriculasActivas = matriculas.filter(m => m.estado === 'Activo' || m.estado === 'Aprobado');

            if (matriculasActivas.length === 0) {
              this.cursosConAsistencia.set([]);
              this.cargando.set(false);
              return;
            }

            const peticiones = matriculasActivas.map(m =>
              forkJoin({
                registros: this.asistenciaService.listarPorMatricula(m.idMatricula),
                porcentaje: this.asistenciaService.obtenerPorcentaje(m.idMatricula)
              })
            );

            forkJoin(peticiones).subscribe({
              next: (resultados) => {
                const cursos: CursoConAsistencia[] = matriculasActivas.map((m, i) => ({
                  idMatricula: m.idMatricula,
                  codigoCurso: m.codigoCurso,
                  nombreCurso: m.nombreCurso,
                  registros: resultados[i].registros,
                  porcentaje: resultados[i].porcentaje
                }));
                this.cursosConAsistencia.set(cursos);
                this.cargando.set(false);
              },
              error: () => {
                this.mensajeError.set('No se pudo cargar la asistencia.');
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

  obtenerEtiquetaEstado(estado: string): string {
    switch (estado) {
      case 'P': return 'Presente';
      case 'A': return 'Ausente';
      case 'T': return 'Tardanza';
      default: return estado;
    }
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'P': return 'badge-exito';
      case 'A': return 'badge-peligro';
      case 'T': return 'badge-advertencia';
      default: return 'badge-neutro';
    }
  }

  obtenerClaseBarra(enRiesgo: boolean): string {
    return enRiesgo ? 'barra-riesgo' : 'barra-ok';
  }
}