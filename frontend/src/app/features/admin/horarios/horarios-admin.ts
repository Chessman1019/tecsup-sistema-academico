import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorarioAdminService } from '../../coordinador/horarios/services/horario-admin.service';
import { CoordinadorService } from '../../coordinador/dashboard/services/coordinador.service';
import { HorarioAdmin, Aula } from '../../coordinador/horarios/models/horario-admin.model';
import { DocenteListado, Curso } from '../../coordinador/dashboard/models/coordinador.model';

const DIAS_SEMANA = [
  { valor: 1, etiqueta: 'Lunes' },
  { valor: 2, etiqueta: 'Martes' },
  { valor: 3, etiqueta: 'Miércoles' },
  { valor: 4, etiqueta: 'Jueves' },
  { valor: 5, etiqueta: 'Viernes' },
  { valor: 6, etiqueta: 'Sábado' }
];

@Component({
  selector: 'app-horarios-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horarios-admin.html',
  styleUrl: './horarios-admin.css'
})
export class HorariosAdmin implements OnInit {

  diasSemana = DIAS_SEMANA;

  horarios = signal<HorarioAdmin[]>([]);
  cursos = signal<Curso[]>([]);
  docentes = signal<DocenteListado[]>([]);
  aulas = signal<Aula[]>([]);

  mostrandoForm = signal(false);
  cursoSeleccionado = signal<string>('');
  docenteSeleccionado = signal<string>('');
  aulaSeleccionada = signal<string>('');
  diaSeleccionado = signal<number | null>(null);
  horaInicio = signal<string>('');
  horaFin = signal<string>('');
  cicloActual = signal<string>('2026-01');

  cargando = signal(false);
  guardando = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  constructor(
    private horarioAdminService: HorarioAdminService,
    private coordinadorService: CoordinadorService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando.set(true);

    this.coordinadorService.listarTodosLosCursos().subscribe({
      next: (cursos) => this.cursos.set(cursos.filter(c => c.estado))
    });

    this.coordinadorService.listarTodosLosDocentes().subscribe({
      next: (docentes) => this.docentes.set(docentes)
    });

    this.horarioAdminService.listarAulas().subscribe({
      next: (aulas) => this.aulas.set(aulas)
    });

    this.cargarHorarios();
  }

  private cargarHorarios(): void {
    this.horarioAdminService.listarTodos().subscribe({
      next: (horarios) => {
        this.horarios.set(horarios);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los horarios.');
        this.cargando.set(false);
      }
    });
  }

  toggleForm(): void {
    this.mostrandoForm.update(v => !v);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  crearHorario(): void {
    const idCurso = this.cursoSeleccionado();
    const idDocente = this.docenteSeleccionado();
    const idAula = this.aulaSeleccionada();
    const dia = this.diaSeleccionado();
    const inicio = this.horaInicio();
    const fin = this.horaFin();

    if (!idCurso || !idDocente || !idAula || dia === null || !inicio || !fin) {
      this.mensajeError.set('Completa todos los campos antes de guardar.');
      return;
    }

    this.guardando.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    this.horarioAdminService.crear({
      idCurso,
      idDocente,
      idAula,
      diaSemana: dia,
      horaInicio: inicio,
      horaFin: fin,
      ciclo: this.cicloActual()
    }).subscribe({
      next: () => {
        this.mensajeExito.set('Horario creado exitosamente.');
        this.mostrandoForm.set(false);
        this.cursoSeleccionado.set('');
        this.docenteSeleccionado.set('');
        this.aulaSeleccionada.set('');
        this.diaSeleccionado.set(null);
        this.horaInicio.set('');
        this.horaFin.set('');
        this.cargarHorarios();
        this.guardando.set(false);
      },
      error: (err) => {
        this.mensajeError.set(err.error?.message || 'No se pudo crear el horario. Verifica que no haya conflictos.');
        this.guardando.set(false);
      }
    });
  }

  obtenerNombreDia(dia: number): string {
    return this.diasSemana.find(d => d.valor === dia)?.etiqueta ?? '';
  }
}