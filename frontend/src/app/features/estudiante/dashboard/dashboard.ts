import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatriculaService } from '../matricula/services/matricula.service';
interface AccesoRapido {
  etiqueta: string;
  descripcion: string;
  ruta: string;
  icono: string;
}

@Component({
  selector: 'app-dashboard-estudiante',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardEstudiante implements OnInit {

  matriculasActivas = signal<number | null>(null);
  cargandoStats = signal(false);

  accesosRapidos: AccesoRapido[] = [
    { etiqueta: 'Matrícula', descripcion: 'Inscríbete en cursos del ciclo', ruta: '/app/estudiante/matricula', icono: '📋' },
    { etiqueta: 'Cursos', descripcion: 'Consulta el catálogo académico', ruta: '/app/estudiante/cursos', icono: '📚' },
    { etiqueta: 'Calificaciones', descripcion: 'Consulta tus notas', ruta: '/app/estudiante/calificaciones', icono: '⭐' },
    { etiqueta: 'Horario', descripcion: 'Revisa tu horario de clases', ruta: '/app/estudiante/horario', icono: '🗓️' },
    { etiqueta: 'Asistencia', descripcion: 'Revisa tu historial', ruta: '/app/estudiante/asistencia', icono: '📅' },
    { etiqueta: 'Certificados', descripcion: 'Solicita constancias', ruta: '/app/estudiante/certificados', icono: '📄' }
  ];

  constructor(
    public authService: AuthService,
    private matriculaService: MatriculaService
  ) {}

  ngOnInit(): void {
    this.cargarStats();
  }

  private cargarStats(): void {
    this.cargandoStats.set(true);
    this.matriculaService.obtenerMiPerfil().subscribe({
      next: (estudiante) => {
        this.matriculaService.listarMisMatriculas(estudiante.idEstudiante).subscribe({
          next: (matriculas) => {
            const activas = matriculas.filter(m => m.estado === 'Activo').length;
            this.matriculasActivas.set(activas);
            this.cargandoStats.set(false);
          },
          error: () => this.cargandoStats.set(false)
        });
      },
      error: () => this.cargandoStats.set(false)
    });
  }
}