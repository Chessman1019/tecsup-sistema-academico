import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatriculaAdminService } from '../../asistente/matriculas/services/matricula-admin.service';
import { MatriculaAdmin } from '../../asistente/matriculas/models/matricula-admin.model';

type FiltroEstado = 'todos' | 'activo' | 'retirado';

@Component({
  selector: 'app-matriculas-coordinador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matriculas-coordinador.html',
  styleUrl: './matriculas-coordinador.css'
})
export class MatriculasCoordinador implements OnInit {

  matriculas = signal<MatriculaAdmin[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);
  textoBusqueda = signal<string>('');
  filtroEstado = signal<FiltroEstado>('todos');

  totalActivas = computed(() => this.matriculas().filter(m => m.estado === 'Activo').length);
  totalRetiradas = computed(() => this.matriculas().filter(m => m.estado === 'Retirado').length);

  matriculasFiltradas = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    const filtro = this.filtroEstado();

    return this.matriculas().filter(m => {
      const coincideTexto = !texto ||
        m.nombreCompletoEstudiante.toLowerCase().includes(texto) ||
        m.codigoAlumno.toLowerCase().includes(texto) ||
        m.nombreCurso.toLowerCase().includes(texto);

      const coincideEstado =
        filtro === 'todos' ||
        (filtro === 'activo' && m.estado === 'Activo') ||
        (filtro === 'retirado' && m.estado === 'Retirado');

      return coincideTexto && coincideEstado;
    });
  });

  constructor(private matriculaAdminService: MatriculaAdminService) {}

  ngOnInit(): void {
    this.cargarMatriculas();
  }

  private cargarMatriculas(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.matriculaAdminService.listarTodasLasMatriculas().subscribe({
      next: (matriculas) => {
        this.matriculas.set(matriculas);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar las matrículas.');
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