import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialService } from './services/material.service';
import { DocenteService } from '../dashboard/services/docente.service';
import { Horario } from '../dashboard/models/horario.model';
import { Material } from './models/material.model';

@Component({
  selector: 'app-materiales-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './materiales-docente.html',
  styleUrl: './materiales-docente.css'
})
export class MaterialesDocente implements OnInit {

  idDocente = signal<string>('');
  horarios = signal<Horario[]>([]);
  materiales = signal<Material[]>([]);

  cursoSeleccionado = signal<string>('');
  tituloNuevo = signal<string>('');
  descripcionNueva = signal<string>('');
  urlNueva = signal<string>('');
  tipoNuevo = signal<string>('PDF');

  mostrandoForm = signal(false);
  cargando = signal(false);
  subiendo = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  cursosUnicos = signal<{ idCurso: string; nombreCurso: string }[]>([]);

  constructor(
    private materialService: MaterialService,
    private docenteService: DocenteService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando.set(true);
    this.docenteService.obtenerMiPerfil().subscribe({
      next: (docente) => {
        this.idDocente.set(docente.idDocente);

        this.docenteService.listarMisHorarios(docente.idDocente).subscribe({
          next: (horarios) => {
            this.horarios.set(horarios);
            const mapa = new Map(horarios.map(h => [h.idCurso, h.nombreCurso]));
            this.cursosUnicos.set(
              Array.from(mapa.entries()).map(([idCurso, nombreCurso]) => ({ idCurso, nombreCurso }))
            );
            this.cargarMateriales(docente.idDocente);
          },
          error: () => this.cargando.set(false)
        });
      },
      error: () => {
        this.mensajeError.set('No se pudo cargar tu perfil de docente.');
        this.cargando.set(false);
      }
    });
  }

  private cargarMateriales(idDocente: string): void {
    this.materialService.listarPorDocente(idDocente).subscribe({
      next: (materiales) => {
        this.materiales.set(materiales);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los materiales.');
        this.cargando.set(false);
      }
    });
  }

  toggleForm(): void {
    this.mostrandoForm.update(v => !v);
  }

  subirMaterial(): void {
    const idCurso = this.cursoSeleccionado();
    const titulo = this.tituloNuevo();

    if (!idCurso || !titulo) {
      this.mensajeError.set('Selecciona un curso e ingresa un título.');
      return;
    }

    this.subiendo.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    this.materialService.crear({
      idCurso,
      titulo,
      descripcion: this.descripcionNueva() || undefined,
      urlArchivo: this.urlNueva() || undefined,
      tipo: this.tipoNuevo()
    }).subscribe({
      next: () => {
        this.mensajeExito.set('Material subido correctamente.');
        this.tituloNuevo.set('');
        this.descripcionNueva.set('');
        this.urlNueva.set('');
        this.cursoSeleccionado.set('');
        this.mostrandoForm.set(false);
        this.subiendo.set(false);
        this.cargarMateriales(this.idDocente());
      },
      error: () => {
        this.mensajeError.set('No se pudo subir el material.');
        this.subiendo.set(false);
      }
    });
  }

  eliminarMaterial(idMaterial: string): void {
    this.materialService.eliminar(idMaterial).subscribe({
      next: () => this.cargarMateriales(this.idDocente()),
      error: () => this.mensajeError.set('No se pudo eliminar el material.')
    });
  }

  obtenerIcono(tipo: string): string {
    const t = tipo.toLowerCase();
    if (t.includes('pdf')) return '📕';
    if (t.includes('video')) return '🎥';
    if (t.includes('link') || t.includes('enlace')) return '🔗';
    return '📁';
  }
}