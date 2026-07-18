import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalificacionDocenteService } from './services/calificacion-docente.service';
import { DocenteService } from '../dashboard/services/docente.service';
import { Horario } from '../dashboard/models/horario.model';
import { Evaluacion } from './models/evaluacion.model';
import { NotaEstudiante } from './models/nota-estudiante.model';

@Component({
  selector: 'app-calificaciones-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calificaciones-docente.html',
  styleUrl: './calificaciones-docente.css'
})
export class CalificacionesDocente implements OnInit {

  horarios = signal<Horario[]>([]);
  horarioSeleccionado = signal<Horario | null>(null);

  evaluaciones = signal<Evaluacion[]>([]);
  evaluacionSeleccionada = signal<string>('');

  nombreNuevaEvaluacion = signal<string>('');
  tipoNuevaEvaluacion = signal<string>('Examen');
  pesoNuevaEvaluacion = signal<number | null>(null);
  mostrandoFormNuevaEvaluacion = signal(false);

  notas = signal<NotaEstudiante[]>([]);

  cargandoHorarios = signal(false);
  cargandoEvaluaciones = signal(false);
  cargandoNotas = signal(false);
  guardando = signal(false);
  creandoEvaluacion = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  constructor(
    private calificacionService: CalificacionDocenteService,
    private docenteService: DocenteService
  ) {}

  ngOnInit(): void {
    this.cargarHorarios();
  }

  private cargarHorarios(): void {
    this.cargandoHorarios.set(true);
    this.docenteService.obtenerMiPerfil().subscribe({
      next: (docente) => {
        this.docenteService.listarMisHorarios(docente.idDocente).subscribe({
          next: (horarios) => {
            this.horarios.set(horarios);
            this.cargandoHorarios.set(false);
          },
          error: () => this.cargandoHorarios.set(false)
        });
      },
      error: () => this.cargandoHorarios.set(false)
    });
  }

  seleccionarHorario(horario: Horario): void {
    this.horarioSeleccionado.set(horario);
    this.evaluacionSeleccionada.set('');
    this.notas.set([]);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
    this.cargarEvaluaciones();
    this.cargarEstudiantes();
  }

  private cargarEvaluaciones(): void {
    const horario = this.horarioSeleccionado();
    if (!horario) return;

    this.cargandoEvaluaciones.set(true);
    this.calificacionService.listarEvaluacionesPorCurso(horario.idCurso).subscribe({
      next: (evaluaciones) => {
        this.evaluaciones.set(evaluaciones);
        this.cargandoEvaluaciones.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar las evaluaciones del curso.');
        this.cargandoEvaluaciones.set(false);
      }
    });
  }

  private cargarEstudiantes(): void {
    const horario = this.horarioSeleccionado();
    if (!horario) return;

    this.cargandoNotas.set(true);
    this.calificacionService.listarMatriculasPorHorario(horario.idHorario).subscribe({
      next: (matriculas) => {
        const activas = matriculas.filter(m => m.estado === 'Activo' || m.estado === 'Aprobado');
        this.notas.set(activas.map(m => ({
          idMatricula: m.idMatricula,
          codigoAlumno: m.codigoAlumno,
          nombreEstudiante: m.nombreCompletoEstudiante,
          nota: null,
          idCalificacionExistente: null
        })));
        this.cargandoNotas.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los estudiantes del curso.');
        this.cargandoNotas.set(false);
      }
    });
  }

  toggleFormNuevaEvaluacion(): void {
    this.mostrandoFormNuevaEvaluacion.update(v => !v);
  }

  crearEvaluacion(): void {
    const horario = this.horarioSeleccionado();
    const nombre = this.nombreNuevaEvaluacion();
    const tipo = this.tipoNuevaEvaluacion();
    const peso = this.pesoNuevaEvaluacion();

    if (!horario || !nombre || peso === null) {
      this.mensajeError.set('Completa el nombre y peso de la evaluación.');
      return;
    }

    this.creandoEvaluacion.set(true);
    this.mensajeError.set(null);

    this.calificacionService.crearEvaluacion({
      idCurso: horario.idCurso,
      nombre,
      tipo,
      peso
    }).subscribe({
      next: (nuevaEvaluacion) => {
        this.evaluaciones.update(lista => [...lista, nuevaEvaluacion]);
        this.evaluacionSeleccionada.set(nuevaEvaluacion.idEvaluacion);
        this.nombreNuevaEvaluacion.set('');
        this.pesoNuevaEvaluacion.set(null);
        this.mostrandoFormNuevaEvaluacion.set(false);
        this.creandoEvaluacion.set(false);
        this.mensajeExito.set('Evaluación creada correctamente.');
      },
      error: () => {
        this.mensajeError.set('No se pudo crear la evaluación.');
        this.creandoEvaluacion.set(false);
      }
    });
  }

  onNotaChange(idMatricula: string, valor: string): void {
    const nota = valor === '' ? null : Number(valor);
    this.notas.update(lista =>
      lista.map(n => n.idMatricula === idMatricula ? { ...n, nota } : n)
    );
  }

  guardarNotas(): void {
    const idEvaluacion = this.evaluacionSeleccionada();
    if (!idEvaluacion) {
      this.mensajeError.set('Selecciona una evaluación antes de guardar.');
      return;
    }

    const notasIngresadas = this.notas().filter(n => n.nota !== null);
    if (notasIngresadas.length === 0) {
      this.mensajeError.set('Ingresa al menos una nota antes de guardar.');
      return;
    }

    this.guardando.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    let completados = 0;
    notasIngresadas.forEach(item => {
      this.calificacionService.registrarNota({
        idMatricula: item.idMatricula,
        idEvaluacion,
        nota: item.nota as number
      }).subscribe({
        next: () => {
          completados++;
          if (completados === notasIngresadas.length) {
            this.mensajeExito.set('Notas registradas correctamente.');
            this.guardando.set(false);
          }
        },
        error: () => {
          this.mensajeError.set('Ocurrió un error al guardar algunas notas.');
          this.guardando.set(false);
        }
      });
    });
  }
}