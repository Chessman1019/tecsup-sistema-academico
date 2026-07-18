import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocenteService } from '../dashboard/services/docente.service';
import { Horario } from '../dashboard/models/horario.model';

const DIAS_SEMANA = ['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

interface CursoAgrupado {
  idCurso: string;
  nombreCurso: string;
  horarios: Horario[];
}

@Component({
  selector: 'app-cursos-docente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cursos-docente.html',
  styleUrl: './cursos-docente.css'
})
export class CursosDocente implements OnInit {

  horarios = signal<Horario[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  cursosAgrupados = computed<CursoAgrupado[]>(() => {
    const mapa = new Map<string, CursoAgrupado>();

    for (const h of this.horarios()) {
      if (!mapa.has(h.idCurso)) {
        mapa.set(h.idCurso, {
          idCurso: h.idCurso,
          nombreCurso: h.nombreCurso,
          horarios: []
        });
      }
      mapa.get(h.idCurso)!.horarios.push(h);
    }

    return Array.from(mapa.values());
  });

  constructor(private docenteService: DocenteService) {}

  ngOnInit(): void {
    this.cargarCursos();
  }

  private cargarCursos(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.docenteService.obtenerMiPerfil().subscribe({
      next: (docente) => {
        this.docenteService.listarMisHorarios(docente.idDocente).subscribe({
          next: (horarios) => {
            this.horarios.set(horarios);
            this.cargando.set(false);
          },
          error: () => {
            this.mensajeError.set('No se pudieron cargar tus cursos.');
            this.cargando.set(false);
          }
        });
      },
      error: () => {
        this.mensajeError.set('No se pudo cargar tu perfil de docente.');
        this.cargando.set(false);
      }
    });
  }

  obtenerNombreDia(dia: number): string {
    return DIAS_SEMANA[dia] ?? '';
  }
}