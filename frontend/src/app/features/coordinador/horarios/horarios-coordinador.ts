import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorarioAdminService } from './services/horario-admin.service';
import { CoordinadorService } from '../dashboard/services/coordinador.service';
import { HorarioAdmin, Aula } from './models/horario-admin.model';
import { DocenteListado, Curso } from '../dashboard/models/coordinador.model';

const DIAS_SEMANA = [
  { valor: 1, etiqueta: 'Lunes' },
  { valor: 2, etiqueta: 'Martes' },
  { valor: 3, etiqueta: 'Miércoles' },
  { valor: 4, etiqueta: 'Jueves' },
  { valor: 5, etiqueta: 'Viernes' },
  { valor: 6, etiqueta: 'Sábado' }
];

@Component({
  selector: 'app-horarios-coordinador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horarios-coordinador.html',
  styleUrl: './horarios-coordinador.css'
})
export class HorariosCoordinador implements OnInit {

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

  textoBusqueda = signal<string>('');
  filtroDia = signal<number | null>(null);

  cargando = signal(false);
  guardando = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  horariosFiltrados = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    const dia = this.filtroDia();

    return this.horarios().filter(h => {
      const coincideTexto = !texto ||
        h.nombreCurso.toLowerCase().includes(texto) ||
        h.nombreDocente.toLowerCase().includes(texto) ||
        h.codigoAula.toLowerCase().includes(texto);

      const coincideDia = dia === null || h.diaSemana === dia;

      return coincideTexto && coincideDia;
    });
  });

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

  onBusquedaChange(valor: string): void {
    this.textoBusqueda.set(valor);
  }

  cambiarFiltroDia(dia: number | null): void {
    this.filtroDia.update(actual => actual === dia ? null : dia);
  }

  abrirFormNuevo(): void {
    this.cursoSeleccionado.set('');
    this.docenteSeleccionado.set('');
    this.aulaSeleccionada.set('');
    this.diaSeleccionado.set(null);
    this.horaInicio.set('');
    this.horaFin.set('');
    this.mostrandoForm.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  cancelarForm(): void {
    this.mostrandoForm.set(false);
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

    if (fin <= inicio) {
      this.mensajeError.set('La hora de fin debe ser posterior a la hora de inicio.');
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