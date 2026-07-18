import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DocenteService } from './services/docente.service';
import { Horario } from './models/horario.model';

const DIAS_SEMANA = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

interface AccesoRapido {
  etiqueta: string;
  descripcion: string;
  ruta: string;
  icono: string;
}

@Component({
  selector: 'app-dashboard-docente',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardDocente implements OnInit {

  horarios = signal<Horario[]>([]);
  cargando = signal(false);

  totalCursos = computed(() => {
    const codigos = new Set(this.horarios().map(h => h.nombreCurso));
    return codigos.size;
  });

  totalHorasSemanales = computed(() => this.horarios().length);

  accesosRapidos: AccesoRapido[] = [
    { etiqueta: 'Mis Cursos', descripcion: 'Consulta los cursos que dictas', ruta: '/app/docente/cursos', icono: '📚' },
    { etiqueta: 'Asistencia', descripcion: 'Registra asistencia de tus alumnos', ruta: '/app/docente/asistencia', icono: '📅' },
    { etiqueta: 'Calificaciones', descripcion: 'Registra notas por evaluación', ruta: '/app/docente/calificaciones', icono: '⭐' },
    { etiqueta: 'Horarios', descripcion: 'Consulta tu horario de clases', ruta: '/app/docente/horarios', icono: '🗓️' }
  ];

  constructor(
    public authService: AuthService,
    private docenteService: DocenteService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando.set(true);
    this.docenteService.obtenerMiPerfil().subscribe({
      next: (docente) => {
        this.docenteService.listarMisHorarios(docente.idDocente).subscribe({
          next: (horarios) => {
            this.horarios.set(horarios);
            this.cargando.set(false);
          },
          error: () => this.cargando.set(false)
        });
      },
      error: () => this.cargando.set(false)
    });
  }

  obtenerNombreDia(dia: number): string {
    return DIAS_SEMANA[dia] ?? '';
  }
}