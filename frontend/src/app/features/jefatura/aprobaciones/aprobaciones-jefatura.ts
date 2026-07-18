import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenciaService } from '../../coordinador/incidencias/services/incidencia.service';
import { Incidencia } from '../../coordinador/incidencias/models/incidencia.model';
import { ModalConfirmacion } from '../../../shared/components/modal-confirmacion/modal-confirmacion';

type AccionAprobacion = 'aprobar' | 'devolver';

@Component({
  selector: 'app-aprobaciones-jefatura',
  standalone: true,
  imports: [CommonModule, ModalConfirmacion],
  templateUrl: './aprobaciones-jefatura.html',
  styleUrl: './aprobaciones-jefatura.css'
})
export class AprobacionesJefatura implements OnInit {

  incidencias = signal<Incidencia[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  // Confirmación
  incidenciaSeleccionada = signal<Incidencia | null>(null);
  accionPendiente = signal<AccionAprobacion | null>(null);
  procesando = signal(false);

  pendientesAprobacion = computed(() =>
    this.incidencias().filter(i => i.estado === 'En proceso')
  );

  constructor(private incidenciaService: IncidenciaService) {}

  ngOnInit(): void {
    this.cargarIncidencias();
  }

  private cargarIncidencias(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.incidenciaService.listarTodas().subscribe({
      next: (incidencias) => {
        this.incidencias.set(incidencias);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar las solicitudes pendientes.');
        this.cargando.set(false);
      }
    });
  }

  pedirAccion(incidencia: Incidencia, accion: AccionAprobacion): void {
    this.incidenciaSeleccionada.set(incidencia);
    this.accionPendiente.set(accion);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  cancelarAccion(): void {
    this.incidenciaSeleccionada.set(null);
    this.accionPendiente.set(null);
  }

  confirmarAccion(): void {
    const incidencia = this.incidenciaSeleccionada();
    const accion = this.accionPendiente();
    if (!incidencia || !accion) return;

    const nuevoEstado = accion === 'aprobar' ? 'Resuelta' : 'Abierta';
    this.procesando.set(true);

    this.incidenciaService.cambiarEstado(incidencia.idIncidencia, nuevoEstado).subscribe({
      next: () => {
        this.mensajeExito.set(
          accion === 'aprobar'
            ? `Incidencia "${incidencia.titulo}" aprobada y marcada como resuelta.`
            : `Incidencia "${incidencia.titulo}" devuelta a coordinación.`
        );
        this.cancelarAccion();
        this.procesando.set(false);
        this.cargarIncidencias();
      },
      error: () => {
        this.mensajeError.set(
          accion === 'aprobar' ? 'No se pudo aprobar la incidencia.' : 'No se pudo devolver la incidencia.'
        );
        this.cancelarAccion();
        this.procesando.set(false);
      }
    });
  }

  obtenerClasePrioridad(prioridad: string): string {
    switch (prioridad) {
      case 'Alta': return 'badge-peligro';
      case 'Baja': return 'badge-neutro';
      default: return 'badge-advertencia';
    }
  }
}