import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgramaService } from './services/programa.service';
import { Programa } from './models/programa.model';
import { Carrera } from '../carreras/models/carrera.model';
import { ModalConfirmacion } from '../../../shared/components/modal-confirmacion/modal-confirmacion';

const TIPOS_PROGRAMA = [
  { valor: 'Carrera Tecnica', etiqueta: 'Carrera Técnica' },
  { valor: 'Diplomado', etiqueta: 'Diplomado' },
  { valor: 'Certificacion', etiqueta: 'Certificación' },
  { valor: 'Curso Corto', etiqueta: 'Curso Corto' }
];

@Component({
  selector: 'app-programas-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalConfirmacion],
  templateUrl: './programas-admin.html',
  styleUrl: './programas-admin.css'
})
export class ProgramasAdmin implements OnInit {

  tiposPrograma = TIPOS_PROGRAMA;

  programas = signal<Programa[]>([]);
  carreras = signal<Carrera[]>([]);
  cargando = signal(false);
  guardando = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  mostrandoForm = signal(false);

  textoBusqueda = signal<string>('');

  nombreNuevo = signal<string>('');
  tipoNuevo = signal<string>('Carrera Tecnica');
  carreraSeleccionada = signal<string>('');

  // Confirmación de cambio de estado
  programaACambiarEstado = signal<Programa | null>(null);
  cambiandoEstado = signal(false);

  programasFiltrados = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    if (!texto) return this.programas();
    return this.programas().filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      p.tipo.toLowerCase().includes(texto) ||
      (p.nombreCarrera && p.nombreCarrera.toLowerCase().includes(texto))
    );
  });

  constructor(private programaService: ProgramaService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando.set(true);

    this.programaService.listarCarreras().subscribe({
      next: (carreras) => this.carreras.set(carreras)
    });

    this.cargarProgramas();
  }

  private cargarProgramas(): void {
    this.mensajeError.set(null);

    this.programaService.listarTodos().subscribe({
      next: (programas) => {
        this.programas.set(programas);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los programas.');
        this.cargando.set(false);
      }
    });
  }

  onBusquedaChange(valor: string): void {
    this.textoBusqueda.set(valor);
  }

  etiquetaTipo(tipo: string): string {
    return TIPOS_PROGRAMA.find(t => t.valor === tipo)?.etiqueta ?? tipo;
  }

  abrirFormNuevo(): void {
    this.nombreNuevo.set('');
    this.tipoNuevo.set('Carrera Tecnica');
    this.carreraSeleccionada.set('');
    this.mostrandoForm.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  cancelarForm(): void {
    this.mostrandoForm.set(false);
  }

  guardar(): void {
    const nombre = this.nombreNuevo();
    const tipo = this.tipoNuevo();

    if (!nombre || !tipo) {
      this.mensajeError.set('Completa el nombre y el tipo.');
      return;
    }

    this.guardando.set(true);
    this.mensajeError.set(null);

    this.programaService.crear({
      nombre,
      tipo,
      idCarrera: this.carreraSeleccionada() || undefined
    }).subscribe({
      next: () => {
        this.mensajeExito.set('Programa creado correctamente.');
        this.mostrandoForm.set(false);
        this.cargarProgramas();
        this.guardando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudo guardar el programa.');
        this.guardando.set(false);
      }
    });
  }

  // ---------- Cambiar estado (con confirmación) ----------

  pedirCambioEstado(programa: Programa): void {
    this.programaACambiarEstado.set(programa);
  }

  confirmarCambioEstado(): void {
    const programa = this.programaACambiarEstado();
    if (!programa) return;

    this.cambiandoEstado.set(true);

    this.programaService.cambiarEstado(programa.idPrograma, !programa.estado).subscribe({
      next: () => {
        this.mensajeExito.set(
          programa.estado
            ? `Programa "${programa.nombre}" desactivado.`
            : `Programa "${programa.nombre}" activado.`
        );
        this.programaACambiarEstado.set(null);
        this.cambiandoEstado.set(false);
        this.cargarProgramas();
      },
      error: () => {
        this.mensajeError.set('No se pudo cambiar el estado del programa.');
        this.programaACambiarEstado.set(null);
        this.cambiandoEstado.set(false);
      }
    });
  }
}