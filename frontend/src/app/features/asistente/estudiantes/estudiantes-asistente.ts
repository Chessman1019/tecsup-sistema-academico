import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenteService } from '../dashboard/services/asistente.service';
import { EstudianteListado } from '../dashboard/models/estudiante-listado.model';

type FiltroEstado = 'todos' | 'activos' | 'inactivos';

@Component({
  selector: 'app-estudiantes-asistente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiantes-asistente.html',
  styleUrl: './estudiantes-asistente.css'
})
export class EstudiantesAsistente implements OnInit {

  estudiantes = signal<EstudianteListado[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);
  textoBusqueda = signal<string>('');
  filtroEstado = signal<FiltroEstado>('todos');

  estudiantesFiltrados = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    const filtro = this.filtroEstado();

    return this.estudiantes().filter(e => {
      const nombreCompleto = `${e.nombres} ${e.apellidos}`.toLowerCase();
      const coincideTexto = !texto ||
        nombreCompleto.includes(texto) ||
        e.codigoAlumno.toLowerCase().includes(texto) ||
        e.correo.toLowerCase().includes(texto);

      const coincideEstado =
        filtro === 'todos' ||
        (filtro === 'activos' && e.estado) ||
        (filtro === 'inactivos' && !e.estado);

      return coincideTexto && coincideEstado;
    });
  });

  constructor(private asistenteService: AsistenteService) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  private cargarEstudiantes(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.asistenteService.listarTodosLosEstudiantes().subscribe({
      next: (estudiantes) => {
        this.estudiantes.set(estudiantes);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los estudiantes.');
        this.cargando.set(false);
      }
    });
  }

  onBusquedaChange(valor: string): void {
    this.textoBusqueda.set(valor);
  }

  cambiarFiltro(filtro: FiltroEstado): void {
    this.filtroEstado.set(filtro);
  }
}