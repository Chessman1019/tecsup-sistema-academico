import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatriculaAdminService } from '../../asistente/matriculas/services/matricula-admin.service';
import { AsistenteService } from '../../asistente/dashboard/services/asistente.service';
import { MatriculaAdmin, Curso, Horario } from '../../asistente/matriculas/models/matricula-admin.model';
import { EstudianteListado } from '../../asistente/dashboard/models/estudiante-listado.model';

@Component({
  selector: 'app-matriculas-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matriculas-admin.html',
  styleUrl: './matriculas-admin.css'
})
export class MatriculasAdmin implements OnInit {

  cicloAcademicoActual = '2026-01';

  estudiantes = signal<EstudianteListado[]>([]);
  cursos = signal<Curso[]>([]);
  horarios = signal<Horario[]>([]);
  matriculas = signal<MatriculaAdmin[]>([]);

  estudianteSeleccionado = signal<string>('');
  cursoSeleccionado = signal<string>('');
  horarioSeleccionado = signal<string>('');

  textoBusquedaMatriculas = signal<string>('');

  cargando = signal(false);
  matriculando = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  matriculasFiltradas = computed(() => {
    const texto = this.textoBusquedaMatriculas().trim().toLowerCase();
    if (!texto) return this.matriculas();

    return this.matriculas().filter(m =>
      m.nombreCompletoEstudiante.toLowerCase().includes(texto) ||
      m.codigoAlumno.toLowerCase().includes(texto) ||
      m.nombreCurso.toLowerCase().includes(texto)
    );
  });

  constructor(
    private matriculaAdminService: MatriculaAdminService,
    private asistenteService: AsistenteService
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  private cargarDatosIniciales(): void {
    this.cargando.set(true);

    this.asistenteService.listarTodosLosEstudiantes().subscribe({
      next: (estudiantes) => this.estudiantes.set(estudiantes)
    });

    this.matriculaAdminService.listarCursosActivos().subscribe({
      next: (cursos) => this.cursos.set(cursos)
    });

    this.cargarMatriculas();
  }

  private cargarMatriculas(): void {
    this.matriculaAdminService.listarTodasLasMatriculas().subscribe({
      next: (matriculas) => {
        this.matriculas.set(matriculas);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar las matrículas.');
        this.cargando.set(false);
      }
    });
  }

  onCursoChange(): void {
    this.horarioSeleccionado.set('');
    this.horarios.set([]);

    const idCurso = this.cursoSeleccionado();
    if (!idCurso) return;

    this.matriculaAdminService.listarHorariosPorCurso(idCurso).subscribe({
      next: (horarios) => this.horarios.set(horarios),
      error: () => this.mensajeError.set('No se pudieron cargar los horarios de este curso.')
    });
  }

  onMatricular(): void {
    const idEstudiante = this.estudianteSeleccionado();
    const idCurso = this.cursoSeleccionado();
    const idHorario = this.horarioSeleccionado();

    if (!idEstudiante || !idCurso || !idHorario) {
      this.mensajeError.set('Selecciona estudiante, curso y horario antes de matricular.');
      return;
    }

    this.matriculando.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    this.matriculaAdminService.matricular({
      idEstudiante,
      idCurso,
      idHorario,
      cicloAcademico: this.cicloAcademicoActual
    }).subscribe({
      next: () => {
        this.mensajeExito.set('Matrícula registrada exitosamente.');
        this.estudianteSeleccionado.set('');
        this.cursoSeleccionado.set('');
        this.horarioSeleccionado.set('');
        this.horarios.set([]);
        this.cargarMatriculas();
        this.matriculando.set(false);
      },
      error: (err) => {
        this.mensajeError.set(err.error?.message || 'No se pudo completar la matrícula.');
        this.matriculando.set(false);
      }
    });
  }

  onRetirar(idMatricula: string): void {
    this.matriculaAdminService.retirarMatricula(idMatricula).subscribe({
      next: () => this.cargarMatriculas(),
      error: () => this.mensajeError.set('No se pudo retirar la matrícula.')
    });
  }

  onBusquedaChange(valor: string): void {
    this.textoBusquedaMatriculas.set(valor);
  }
}