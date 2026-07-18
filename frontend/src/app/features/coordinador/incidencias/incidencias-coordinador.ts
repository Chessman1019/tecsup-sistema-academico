import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidenciaService } from './services/incidencia.service';
import { CoordinadorService } from '../dashboard/services/coordinador.service';
import { Incidencia } from './models/incidencia.model';
import { DocenteListado, Curso } from '../dashboard/models/coordinador.model';
import { ModalConfirmacion } from '../../../shared/components/modal-confirmacion/modal-confirmacion';

type FiltroEstado = 'todas' | 'Abierta' | 'En proceso' | 'Resuelta';

@Component({
  selector: 'app-incidencias-coordinador',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalConfirmacion],
  templateUrl: './incidencias-coordinador.html',
  styleUrl: './incidencias-coordinador.css'
})
export class IncidenciasCoordinador implements OnInit {

  incidencias = signal<Incidencia[]>([]);
  docentes = signal<DocenteListado[]>([]);
  cursos = signal<Curso[]>([]);

  mostrandoForm = signal(false);
  filtroEstado = signal<FiltroEstado>('todas');

  tituloNuevo = signal<string>('');
  descripcionNueva = signal<string>('');
  tipoNuevo = signal<string>('Académica');
  prioridadNueva = signal<string>('Media');
  docenteSeleccionado = signal<string>('');
  cursoSeleccionado = signal<string>('');

  cargando = signal(false);
  guardando = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  // Confirmación de avance de estado
  incidenciaAAvanzar = signal<Incidencia | null>(null);
  avanzando = signal(false);

  incidenciasFiltradas = computed(() => {
    const filtro = this.filtroEstado();
    if (filtro === 'todas') return this.incidencias();
    return this.incidencias().filter(i => i.estado === filtro);
  });

  totalAbiertas = computed(() =>
    this.incidencias().filter(i => i.estado === 'Abierta').length
  );

  constructor(
    private incidenciaService: IncidenciaService,
    private coordinadorService: CoordinadorService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando.set(true);

    this.coordinadorService.listarTodosLosDocentes().subscribe({
      next: (docentes) => this.docentes.set(docentes)
    });

    this.coordinadorService.listarTodosLosCursos().subscribe({
      next: (cursos) => this.cursos.set(cursos)
    });

    this.cargarIncidencias();
  }

  private cargarIncidencias(): void {
    this.incidenciaService.listarTodas().subscribe({
      next: (incidencias) => {
        this.incidencias.set(incidencias);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar las incidencias.');
        this.cargando.set(false);
      }
    });
  }

  abrirFormNuevo(): void {
    this.tituloNuevo.set('');
    this.descripcionNueva.set('');
    this.tipoNuevo.set('Académica');
    this.prioridadNueva.set('Media');
    this.docenteSeleccionado.set('');
    this.cursoSeleccionado.set('');
    this.mostrandoForm.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  cancelarForm(): void {
    this.mostrandoForm.set(false);
  }

  crearIncidencia(): void {
    const titulo = this.tituloNuevo();
    const descripcion = this.descripcionNueva();

    if (!titulo || !descripcion) {
      this.mensajeError.set('Completa el título y la descripción.');
      return;
    }

    this.guardando.set(true);
    this.mensajeError.set(null);

    this.incidenciaService.crear({
      titulo,
      descripcion,
      tipo: this.tipoNuevo(),
      prioridad: this.prioridadNueva(),
      idDocente: this.docenteSeleccionado() || undefined,
      idCurso: this.cursoSeleccionado() || undefined
    }).subscribe({
      next: () => {
        this.mensajeExito.set('Incidencia registrada correctamente.');
        this.mostrandoForm.set(false);
        this.cargarIncidencias();
        this.guardando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudo registrar la incidencia.');
        this.guardando.set(false);
      }
    });
  }

  cambiarFiltro(filtro: FiltroEstado): void {
    this.filtroEstado.set(filtro);
  }

  // ---------- Avanzar estado (con confirmación) ----------

  siguienteEstado(incidencia: Incidencia): string {
    return incidencia.estado === 'En proceso' ? 'Resuelta' : 'En proceso';
  }

  pedirAvance(incidencia: Incidencia): void {
    this.incidenciaAAvanzar.set(incidencia);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  confirmarAvance(): void {
    const incidencia = this.incidenciaAAvanzar();
    if (!incidencia) return;

    const nuevoEstado = this.siguienteEstado(incidencia);
    this.avanzando.set(true);

    this.incidenciaService.cambiarEstado(incidencia.idIncidencia, nuevoEstado).subscribe({
      next: () => {
        this.mensajeExito.set(`Incidencia "${incidencia.titulo}" marcada como ${nuevoEstado}.`);
        this.incidenciaAAvanzar.set(null);
        this.avanzando.set(false);
        this.cargarIncidencias();
      },
      error: () => {
        this.mensajeError.set('No se pudo actualizar el estado.');
        this.incidenciaAAvanzar.set(null);
        this.avanzando.set(false);
      }
    });
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'Resuelta': return 'badge-exito';
      case 'En proceso': return 'badge-info';
      default: return 'badge-advertencia';
    }
  }

  obtenerClasePrioridad(prioridad: string): string {
    switch (prioridad) {
      case 'Alta': return 'badge-peligro';
      case 'Baja': return 'badge-neutro';
      default: return 'badge-advertencia';
    }
  }
}