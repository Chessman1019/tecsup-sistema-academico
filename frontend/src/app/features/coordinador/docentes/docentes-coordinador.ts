import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoordinadorService } from '../dashboard/services/coordinador.service';
import { DocenteListado } from '../dashboard/models/coordinador.model';

@Component({
  selector: 'app-docentes-coordinador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './docentes-coordinador.html',
  styleUrl: './docentes-coordinador.css'
})
export class DocentesCoordinador implements OnInit {

  docentes = signal<DocenteListado[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);
  textoBusqueda = signal<string>('');

  docentesFiltrados = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    if (!texto) return this.docentes();

    return this.docentes().filter(d => {
      const nombreCompleto = `${d.nombres} ${d.apellidos}`.toLowerCase();
      return nombreCompleto.includes(texto) ||
        d.codigoDocente.toLowerCase().includes(texto) ||
        d.correo.toLowerCase().includes(texto) ||
        (d.especialidad && d.especialidad.toLowerCase().includes(texto));
    });
  });

  constructor(private coordinadorService: CoordinadorService) {}

  ngOnInit(): void {
    this.cargarDocentes();
  }

  private cargarDocentes(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.coordinadorService.listarTodosLosDocentes().subscribe({
      next: (docentes) => {
        this.docentes.set(docentes);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los docentes.');
        this.cargando.set(false);
      }
    });
  }

  onBusquedaChange(valor: string): void {
    this.textoBusqueda.set(valor);
  }
}