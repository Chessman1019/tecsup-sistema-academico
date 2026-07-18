import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { DocenteService } from '../dashboard/services/docente.service';
import { CalificacionDocenteService } from '../calificaciones/services/calificacion-docente.service';
import { MatriculaCurso } from '../calificaciones/models/nota-estudiante.model';

interface EstudianteConCurso extends MatriculaCurso {}

@Component({
  selector: 'app-estudiantes-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiantes-docente.html',
  styleUrl: './estudiantes-docente.css'
})
export class EstudiantesDocente implements OnInit {

  estudiantes = signal<EstudianteConCurso[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);
  textoBusqueda = signal<string>('');
  cursoFiltro = signal<string>('');

  cursosDisponibles = computed(() => {
    const nombres = new Set(this.estudiantes().map(e => e.nombreCurso));
    return Array.from(nombres);
  });

  estudiantesFiltrados = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    const curso = this.cursoFiltro();

    return this.estudiantes().filter(e => {
      const coincideTexto = !texto ||
        e.nombreCompletoEstudiante.toLowerCase().includes(texto) ||
        e.codigoAlumno.toLowerCase().includes(texto);
      const coincideCurso = !curso || e.nombreCurso === curso;
      return coincideTexto && coincideCurso;
    });
  });

  constructor(
    private docenteService: DocenteService,
    private calificacionService: CalificacionDocenteService
  ) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  private cargarEstudiantes(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.docenteService.obtenerMiPerfil().subscribe({
      next: (docente) => {
        this.docenteService.listarMisHorarios(docente.idDocente).subscribe({
          next: (horarios) => {
            if (horarios.length === 0) {
              this.estudiantes.set([]);
              this.cargando.set(false);
              return;
            }

            const peticiones = horarios.map(h =>
              this.calificacionService.listarMatriculasPorHorario(h.idHorario)
            );

            forkJoin(peticiones).subscribe({
              next: (resultados) => {
                const todos = resultados.flat().filter(m => m.estado === 'Activo' || m.estado === 'Aprobado');
                this.estudiantes.set(todos);
                this.cargando.set(false);
              },
              error: () => {
                this.mensajeError.set('No se pudieron cargar los estudiantes.');
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

  onBusquedaChange(valor: string): void {
    this.textoBusqueda.set(valor);
  }
}