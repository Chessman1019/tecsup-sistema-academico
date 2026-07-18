import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeriodoService } from './services/periodo.service';
import { Periodo } from './models/periodo.model';

@Component({
  selector: 'app-periodos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './periodos-admin.html',
  styleUrl: './periodos-admin.css'
})
export class PeriodosAdmin implements OnInit {

  periodos = signal<Periodo[]>([]);
  cargando = signal(false);
  guardando = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  mostrandoForm = signal(false);

  textoBusqueda = signal<string>('');

  codigoNuevo = signal<string>('');
  fechaInicioNueva = signal<string>('');
  fechaFinNueva = signal<string>('');

  periodosFiltrados = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    if (!texto) return this.periodos();
    return this.periodos().filter(p =>
      p.codigo.toLowerCase().includes(texto) ||
      p.estado.toLowerCase().includes(texto)
    );
  });

  constructor(private periodoService: PeriodoService) {}

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  private cargarPeriodos(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.periodoService.listarTodos().subscribe({
      next: (periodos) => {
        this.periodos.set(periodos);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los períodos académicos.');
        this.cargando.set(false);
      }
    });
  }

  onBusquedaChange(valor: string): void {
    this.textoBusqueda.set(valor);
  }

  abrirFormNuevo(): void {
    this.codigoNuevo.set('');
    this.fechaInicioNueva.set('');
    this.fechaFinNueva.set('');
    this.mostrandoForm.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  cancelarForm(): void {
    this.mostrandoForm.set(false);
  }

  guardar(): void {
    const codigo = this.codigoNuevo();
    const inicio = this.fechaInicioNueva();
    const fin = this.fechaFinNueva();

    if (!codigo || !inicio || !fin) {
      this.mensajeError.set('Completa todos los campos.');
      return;
    }

    if (fin <= inicio) {
      this.mensajeError.set('La fecha de fin debe ser posterior a la fecha de inicio.');
      return;
    }

    this.guardando.set(true);
    this.mensajeError.set(null);

    this.periodoService.crear({
      codigo,
      fechaInicio: inicio,
      fechaFin: fin
    }).subscribe({
      next: () => {
        this.mensajeExito.set('Período académico creado correctamente.');
        this.mostrandoForm.set(false);
        this.cargarPeriodos();
        this.guardando.set(false);
      },
      error: (err) => {
        this.mensajeError.set(err.error?.message || 'No se pudo guardar el período.');
        this.guardando.set(false);
      }
    });
  }

  obtenerClaseBadge(estado: string): string {
    switch (estado) {
      case 'Activo': return 'badge-exito';
      case 'Cerrado': return 'badge-neutro';
      default: return 'badge-info';
    }
  }
}