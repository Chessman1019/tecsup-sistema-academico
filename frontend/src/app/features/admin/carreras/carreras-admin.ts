import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarreraService } from './services/carrera.service';
import { Carrera } from './models/carrera.model';
import { Sede } from '../sedes/models/sede.model';
import { ModalConfirmacion } from '../../../shared/components/modal-confirmacion/modal-confirmacion';

@Component({
  selector: 'app-carreras-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalConfirmacion],
  templateUrl: './carreras-admin.html',
  styleUrl: './carreras-admin.css'
})
export class CarrerasAdmin implements OnInit {

  carreras = signal<Carrera[]>([]);
  sedes = signal<Sede[]>([]);
  cargando = signal(false);
  guardando = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  mostrandoForm = signal(false);
  editandoIdCarrera = signal<string | null>(null);

  textoBusqueda = signal<string>('');

  codigoNuevo = signal<string>('');
  nombreNuevo = signal<string>('');
  duracionNueva = signal<number | null>(null);
  sedeSeleccionada = signal<string>('');

  // Confirmación de cambio de estado
  carreraACambiarEstado = signal<Carrera | null>(null);
  cambiandoEstado = signal(false);

  carrerasFiltradas = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    if (!texto) return this.carreras();
    return this.carreras().filter(c =>
      c.nombre.toLowerCase().includes(texto) ||
      c.codigo.toLowerCase().includes(texto) ||
      (c.nombreSede && c.nombreSede.toLowerCase().includes(texto))
    );
  });

  constructor(private carreraService: CarreraService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando.set(true);

    this.carreraService.listarSedes().subscribe({
      next: (sedes) => this.sedes.set(sedes)
    });

    this.cargarCarreras();
  }

  private cargarCarreras(): void {
    this.mensajeError.set(null);

    this.carreraService.listarTodas().subscribe({
      next: (carreras) => {
        this.carreras.set(carreras);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar las carreras.');
        this.cargando.set(false);
      }
    });
  }

  onBusquedaChange(valor: string): void {
    this.textoBusqueda.set(valor);
  }

  abrirFormNuevo(): void {
    this.editandoIdCarrera.set(null);
    this.codigoNuevo.set('');
    this.nombreNuevo.set('');
    this.duracionNueva.set(6);
    this.sedeSeleccionada.set('');
    this.mostrandoForm.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  cancelarForm(): void {
    this.mostrandoForm.set(false);
    this.editandoIdCarrera.set(null);
  }

  guardar(): void {
    const codigo = this.codigoNuevo();
    const nombre = this.nombreNuevo();
    const duracion = this.duracionNueva();

    if (!codigo || !nombre || duracion === null) {
      this.mensajeError.set('Completa el código, nombre y duración.');
      return;
    }

    this.guardando.set(true);
    this.mensajeError.set(null);

    const request = {
      codigo,
      nombre,
      duracionCiclos: duracion,
      idSede: this.sedeSeleccionada() || undefined
    };

    this.carreraService.crear(request).subscribe({
      next: () => {
        this.mensajeExito.set('Carrera creada correctamente.');
        this.mostrandoForm.set(false);
        this.cargarCarreras();
        this.guardando.set(false);
      },
      error: (err) => {
        this.mensajeError.set(err.error?.message || 'No se pudo guardar la carrera.');
        this.guardando.set(false);
      }
    });
  }

  // ---------- Cambiar estado (con confirmación) ----------

  pedirCambioEstado(carrera: Carrera): void {
    this.carreraACambiarEstado.set(carrera);
  }

  confirmarCambioEstado(): void {
    const carrera = this.carreraACambiarEstado();
    if (!carrera) return;

    this.cambiandoEstado.set(true);

    this.carreraService.cambiarEstado(carrera.idCarrera, !carrera.estado).subscribe({
      next: () => {
        this.mensajeExito.set(
          carrera.estado
            ? `Carrera "${carrera.nombre}" desactivada.`
            : `Carrera "${carrera.nombre}" activada.`
        );
        this.carreraACambiarEstado.set(null);
        this.cambiandoEstado.set(false);
        this.cargarCarreras();
      },
      error: () => {
        this.mensajeError.set('No se pudo cambiar el estado de la carrera.');
        this.carreraACambiarEstado.set(null);
        this.cambiandoEstado.set(false);
      }
    });
  }
}