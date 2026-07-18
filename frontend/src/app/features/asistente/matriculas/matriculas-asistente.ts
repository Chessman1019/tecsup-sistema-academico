import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatriculaAdminService } from './services/matricula-admin.service';
import { AsistenteService } from '../dashboard/services/asistente.service';
import { EstudianteListado } from '../dashboard/models/estudiante-listado.model';
import { MatriculaAdmin, Curso, Horario } from './models/matricula-admin.model';
import { ModalConfirmacion } from '../../../shared/components/modal-confirmacion/modal-confirmacion';

const DIAS_SEMANA = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

@Component({
  selector: 'app-matriculas-asistente',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalConfirmacion],
  templateUrl: './matriculas-asistente.html',
  styleUrl: './matriculas-asistente.css'
})
export class MatriculasAsistente implements OnInit {

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

  mostrandoForm = signal(false);

  // Confirmación de retiro
  matriculaARetirar = signal<MatriculaAdmin | null>(null);
  retirando = signal(false);

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

  obtenerNombreDia(dia: number): string {
    return DIAS_SEMANA[dia] ?? '';
  }

  abrirFormNueva(): void {
    this.estudianteSeleccionado.set('');
    this.cursoSeleccionado.set('');
    this.horarioSeleccionado.set('');
    this.horarios.set([]);
    this.mostrandoForm.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  cancelarForm(): void {
    this.mostrandoForm.set(false);
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
        this.mostrandoForm.set(false);
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

  // ---------- Retirar (con confirmación) ----------

  pedirRetiro(matricula: MatriculaAdmin): void {
    this.matriculaARetirar.set(matricula);
  }

  confirmarRetiro(): void {
    const matricula = this.matriculaARetirar();
    if (!matricula) return;

    this.retirando.set(true);

    this.matriculaAdminService.retirarMatricula(matricula.idMatricula).subscribe({
      next: () => {
        this.mensajeExito.set(
          `Matrícula de ${matricula.nombreCompletoEstudiante} en "${matricula.nombreCurso}" retirada.`
        );
        this.matriculaARetirar.set(null);
        this.retirando.set(false);
        this.cargarMatriculas();
      },
      error: () => {
        this.mensajeError.set('No se pudo retirar la matrícula.');
        this.matriculaARetirar.set(null);
        this.retirando.set(false);
      }
    });
  }

  onBusquedaChange(valor: string): void {
    this.textoBusquedaMatriculas.set(valor);
  }
}