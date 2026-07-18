import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SedeService } from './services/sede.service';
import { Sede } from './models/sede.model';
import { ModalConfirmacion } from '../../../shared/components/modal-confirmacion/modal-confirmacion';

@Component({
  selector: 'app-sedes-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalConfirmacion],
  templateUrl: './sedes-admin.html',
  styleUrl: './sedes-admin.css'
})
export class SedesAdmin implements OnInit {

  sedes = signal<Sede[]>([]);
  cargando = signal(false);
  guardando = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  mostrandoForm = signal(false);
  editandoIdSede = signal<string | null>(null);

  textoBusqueda = signal<string>('');

  nombreNuevo = signal<string>('');
  direccionNueva = signal<string>('');
  ciudadNueva = signal<string>('');

  // Confirmación de cambio de estado
  sedeACambiarEstado = signal<Sede | null>(null);
  cambiandoEstado = signal(false);

  sedesFiltradas = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    if (!texto) return this.sedes();
    return this.sedes().filter(s =>
      s.nombre.toLowerCase().includes(texto) ||
      s.ciudad.toLowerCase().includes(texto)
    );
  });

  constructor(private sedeService: SedeService) {}

  ngOnInit(): void {
    this.cargarSedes();
  }

  private cargarSedes(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.sedeService.listarTodas().subscribe({
      next: (sedes) => {
        this.sedes.set(sedes);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar las sedes.');
        this.cargando.set(false);
      }
    });
  }

  onBusquedaChange(valor: string): void {
    this.textoBusqueda.set(valor);
  }

  abrirFormNuevo(): void {
    this.editandoIdSede.set(null);
    this.nombreNuevo.set('');
    this.direccionNueva.set('');
    this.ciudadNueva.set('');
    this.mostrandoForm.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  abrirFormEditar(sede: Sede): void {
    this.editandoIdSede.set(sede.idSede);
    this.nombreNuevo.set(sede.nombre);
    this.direccionNueva.set(sede.direccion ?? '');
    this.ciudadNueva.set(sede.ciudad);
    this.mostrandoForm.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  cancelarForm(): void {
    this.mostrandoForm.set(false);
    this.editandoIdSede.set(null);
  }

  guardar(): void {
    const nombre = this.nombreNuevo();
    const ciudad = this.ciudadNueva();

    if (!nombre || !ciudad) {
      this.mensajeError.set('Completa el nombre y la ciudad.');
      return;
    }

    this.guardando.set(true);
    this.mensajeError.set(null);

    const request = {
      nombre,
      direccion: this.direccionNueva() || undefined,
      ciudad
    };

    const idEditando = this.editandoIdSede();

    const peticion = idEditando
      ? this.sedeService.actualizar(idEditando, request)
      : this.sedeService.crear(request);

    peticion.subscribe({
      next: () => {
        this.mensajeExito.set(idEditando ? 'Sede actualizada correctamente.' : 'Sede creada correctamente.');
        this.mostrandoForm.set(false);
        this.editandoIdSede.set(null);
        this.cargarSedes();
        this.guardando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudo guardar la sede.');
        this.guardando.set(false);
      }
    });
  }

  // ---------- Cambiar estado (con confirmación) ----------

  pedirCambioEstado(sede: Sede): void {
    this.sedeACambiarEstado.set(sede);
  }

  confirmarCambioEstado(): void {
    const sede = this.sedeACambiarEstado();
    if (!sede) return;

    this.cambiandoEstado.set(true);

    this.sedeService.cambiarEstado(sede.idSede, !sede.estado).subscribe({
      next: () => {
        this.mensajeExito.set(
          sede.estado
            ? `Sede "${sede.nombre}" desactivada.`
            : `Sede "${sede.nombre}" activada.`
        );
        this.sedeACambiarEstado.set(null);
        this.cambiandoEstado.set(false);
        this.cargarSedes();
      },
      error: () => {
        this.mensajeError.set('No se pudo cambiar el estado de la sede.');
        this.sedeACambiarEstado.set(null);
        this.cambiandoEstado.set(false);
      }
    });
  }
}