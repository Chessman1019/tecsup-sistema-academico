import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AsistenteService } from './services/asistente.service';
import { EstudianteListado } from './models/estudiante-listado.model';

interface AccesoRapido {
  etiqueta: string;
  descripcion: string;
  ruta: string;
  icono: string;
}

@Component({
  selector: 'app-dashboard-asistente',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardAsistente implements OnInit {

  estudiantes = signal<EstudianteListado[]>([]);
  cargando = signal(false);

  totalEstudiantes = computed(() => this.estudiantes().length);
  totalActivos = computed(() => this.estudiantes().filter(e => e.estado).length);

  accesosRapidos: AccesoRapido[] = [
    { etiqueta: 'Estudiantes', descripcion: 'Consulta y gestiona estudiantes', ruta: '/app/asistente/estudiantes', icono: '👥' },
    { etiqueta: 'Matrículas', descripcion: 'Gestiona inscripciones', ruta: '/app/asistente/matriculas', icono: '📋' },
    { etiqueta: 'Pagos', descripcion: 'Consulta pagos registrados', ruta: '/app/asistente/pagos', icono: '💳' },
    { etiqueta: 'Documentos', descripcion: 'Gestiona documentos de estudiantes', ruta: '/app/asistente/documentos', icono: '🗂️' }
  ];

  constructor(
    public authService: AuthService,
    private asistenteService: AsistenteService
  ) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  private cargarEstudiantes(): void {
    this.cargando.set(true);
    this.asistenteService.listarTodosLosEstudiantes().subscribe({
      next: (estudiantes) => {
        this.estudiantes.set(estudiantes);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}