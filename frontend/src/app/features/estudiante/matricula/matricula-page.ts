import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatriculaService } from './services/matricula.service';
import { Curso } from './models/curso.model';
import { Horario } from './models/horario.model';
import { Matricula } from './models/matricula.model';
import { Estudiante } from './models/estudiante.model';
import { ModalConfirmacion } from '../../../shared/components/modal-confirmacion/modal-confirmacion';

const DIAS_SEMANA = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

@Component({
  selector: 'app-matricula-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalConfirmacion],
  templateUrl: './matricula-page.html',
  styleUrl: './matricula-page.css'
})
export class MatriculaPage implements OnInit {

  cicloAcademicoActual = '2026-01';

  perfilEstudiante = signal<Estudiante | null>(null);
  cursos = signal<Curso[]>([]);
  horarios = signal<Horario[]>([]);
  misMatriculas = signal<Matricula[]>([]);

  cursoSeleccionado = signal<string>('');
  horarioSeleccionado = signal<string>('');

  cargando = signal(false);
  matriculando = signal(false);
  cargandoHorarios = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  // Confirmación de retiro
  matriculaARetirar = signal<Matricula | null>(null);
  retirando = signal(false);

  constructor(private matriculaService: MatriculaService) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  private cargarDatosIniciales(): void {
    this.cargando.set(true);

    this.matriculaService.obtenerMiPerfil().subscribe({
      next: (estudiante) => {
        this.perfilEstudiante.set(estudiante);
        this.cargarMisMatriculas(estudiante.idEstudiante);
      },
      error: () => {
        this.mensajeError.set('No se pudo cargar tu perfil de estudiante.');
        this.cargando.set(false);
      }
    });

    this.matriculaService.listarCursosActivos().subscribe({
      next: (cursos) => {
        this.cursos.set(cursos);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los cursos disponibles.');
        this.cargando.set(false);
      }
    });
  }

  private cargarMisMatriculas(idEstudiante: string): void {
    this.matriculaService.listarMisMatriculas(idEstudiante).subscribe({
      next: (matriculas) => this.misMatriculas.set(matriculas),
      error: () => this.mensajeError.set('No se pudieron cargar tus matrículas.')
    });
  }

  obtenerNombreDia(dia: number): string {
    return DIAS_SEMANA[dia] ?? '';
  }

  onCursoChange(): void {
    this.horarioSeleccionado.set('');
    this.horarios.set([]);

    const idCurso = this.cursoSeleccionado();
    if (!idCurso) {
      return;
    }

    this.cargandoHorarios.set(true);
    this.matriculaService.listarHorariosPorCurso(idCurso).subscribe({
      next: (horarios) => {
        this.horarios.set(horarios);
        this.cargandoHorarios.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los horarios de este curso.');
        this.cargandoHorarios.set(false);
      }
    });
  }

  seleccionarHorario(idHorario: string): void {
    this.horarioSeleccionado.set(idHorario);
  }

  onMatricular(): void {
    const estudiante = this.perfilEstudiante();
    const idCurso = this.cursoSeleccionado();
    const idHorario = this.horarioSeleccionado();

    if (!estudiante || !idCurso || !idHorario) {
      this.mensajeError.set('Selecciona un curso y un horario antes de matricularte.');
      return;
    }

    this.mensajeError.set(null);
    this.mensajeExito.set(null);
    this.matriculando.set(true);

    this.matriculaService.matricular({
      idEstudiante: estudiante.idEstudiante,
      idCurso,
      idHorario,
      cicloAcademico: this.cicloAcademicoActual
    }).subscribe({
      next: () => {
        this.mensajeExito.set('¡Matrícula registrada exitosamente! Revisa tus notificaciones.');
        this.cursoSeleccionado.set('');
        this.horarioSeleccionado.set('');
        this.horarios.set([]);
        this.cargarMisMatriculas(estudiante.idEstudiante);
        this.matriculando.set(false);
      },
      error: (err) => {
        this.mensajeError.set(err.error?.message || 'No se pudo completar la matrícula.');
        this.matriculando.set(false);
      }
    });
  }

  // ---------- Retirar (con confirmación) ----------

  pedirRetiro(matricula: Matricula): void {
    this.matriculaARetirar.set(matricula);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  confirmarRetiro(): void {
    const matricula = this.matriculaARetirar();
    const estudiante = this.perfilEstudiante();
    if (!matricula || !estudiante) return;

    this.retirando.set(true);

    this.matriculaService.retirarMatricula(matricula.idMatricula).subscribe({
      next: () => {
        this.mensajeExito.set(`Te retiraste del curso "${matricula.nombreCurso}".`);
        this.matriculaARetirar.set(null);
        this.retirando.set(false);
        this.cargarMisMatriculas(estudiante.idEstudiante);
      },
      error: () => {
        this.mensajeError.set('No se pudo retirar la matrícula.');
        this.matriculaARetirar.set(null);
        this.retirando.set(false);
      }
    });
  }
}