import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AulaService } from './services/aula.service';
import { Aula } from './models/aula.model';

const TIPOS_AULA = [
  { valor: 'Teoria', etiqueta: 'Teoría' },
  { valor: 'Laboratorio', etiqueta: 'Laboratorio' },
  { valor: 'Taller', etiqueta: 'Taller' },
  { valor: 'Auditorio', etiqueta: 'Auditorio' }
];

@Component({
  selector: 'app-aulas-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aulas-admin.html',
  styleUrl: './aulas-admin.css'
})
export class AulasAdmin implements OnInit {

  tiposAula = TIPOS_AULA;

  aulas = signal<Aula[]>([]);
  cargando = signal(false);
  guardando = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  mostrandoForm = signal(false);
  editandoIdAula = signal<string | null>(null);

  textoBusqueda = signal<string>('');

  codigoNuevo = signal<string>('');
  edificioNuevo = signal<string>('');
  capacidadNueva = signal<number | null>(null);
  tipoNuevo = signal<string>('Teoria');

  aulasFiltradas = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    if (!texto) return this.aulas();
    return this.aulas().filter(a =>
      a.codigo.toLowerCase().includes(texto) ||
      a.edificio.toLowerCase().includes(texto) ||
      (a.tipo && a.tipo.toLowerCase().includes(texto))
    );
  });

  constructor(private aulaService: AulaService) {}

  ngOnInit(): void {
    this.cargarAulas();
  }

  private cargarAulas(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.aulaService.listarTodas().subscribe({
      next: (aulas) => {
        this.aulas.set(aulas);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar las aulas.');
        this.cargando.set(false);
      }
    });
  }

  onBusquedaChange(valor: string): void {
    this.textoBusqueda.set(valor);
  }

  etiquetaTipo(tipo: string | null): string {
    if (!tipo) return '—';
    return TIPOS_AULA.find(t => t.valor === tipo)?.etiqueta ?? tipo;
  }

  abrirFormNuevo(): void {
    this.editandoIdAula.set(null);
    this.codigoNuevo.set('');
    this.edificioNuevo.set('');
    this.capacidadNueva.set(null);
    this.tipoNuevo.set('Teoria');
    this.mostrandoForm.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  abrirFormEditar(aula: Aula): void {
    this.editandoIdAula.set(aula.idAula);
    this.codigoNuevo.set(aula.codigo);
    this.edificioNuevo.set(aula.edificio);
    this.capacidadNueva.set(aula.capacidad);
    this.tipoNuevo.set(aula.tipo ?? 'Teoria');
    this.mostrandoForm.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  cancelarForm(): void {
    this.mostrandoForm.set(false);
    this.editandoIdAula.set(null);
  }

  guardar(): void {
    const codigo = this.codigoNuevo();
    const edificio = this.edificioNuevo();
    const capacidad = this.capacidadNueva();

    if (!codigo || !edificio || capacidad === null) {
      this.mensajeError.set('Completa código, edificio y capacidad.');
      return;
    }

    if (capacidad <= 0) {
      this.mensajeError.set('La capacidad debe ser mayor a 0.');
      return;
    }

    this.guardando.set(true);
    this.mensajeError.set(null);

    const request = {
      codigo,
      edificio,
      capacidad,
      tipo: this.tipoNuevo()
    };

    const idEditando = this.editandoIdAula();

    const peticion = idEditando
      ? this.aulaService.actualizar(idEditando, request)
      : this.aulaService.crear(request);

    peticion.subscribe({
      next: () => {
        this.mensajeExito.set(idEditando ? 'Aula actualizada correctamente.' : 'Aula creada correctamente.');
        this.mostrandoForm.set(false);
        this.editandoIdAula.set(null);
        this.cargarAulas();
        this.guardando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudo guardar el aula.');
        this.guardando.set(false);
      }
    });
  }
}