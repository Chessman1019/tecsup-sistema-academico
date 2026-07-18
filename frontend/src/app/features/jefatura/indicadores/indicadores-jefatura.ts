import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoordinadorService } from '../../coordinador/dashboard/services/coordinador.service';
import { MatriculaAdminService } from '../../asistente/matriculas/services/matricula-admin.service';

interface IndicadorCurso {
  nombreCurso: string;
  totalMatriculados: number;
}

@Component({
  selector: 'app-indicadores-jefatura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './indicadores-jefatura.html',
  styleUrl: './indicadores-jefatura.css'
})
export class IndicadoresJefatura implements OnInit {

  indicadoresPorCurso = signal<IndicadorCurso[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  maximoMatriculados = computed(() => {
    const valores = this.indicadoresPorCurso().map(i => i.totalMatriculados);
    return valores.length > 0 ? Math.max(...valores) : 1;
  });

  constructor(
    private coordinadorService: CoordinadorService,
    private matriculaAdminService: MatriculaAdminService
  ) {}

  ngOnInit(): void {
    this.cargarIndicadores();
  }

  private cargarIndicadores(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.matriculaAdminService.listarTodasLasMatriculas().subscribe({
      next: (matriculas) => {
        const activas = matriculas.filter(m => m.estado === 'Activo');
        const mapa = new Map<string, number>();

        for (const m of activas) {
          mapa.set(m.nombreCurso, (mapa.get(m.nombreCurso) ?? 0) + 1);
        }

        const indicadores = Array.from(mapa.entries())
          .map(([nombreCurso, totalMatriculados]) => ({ nombreCurso, totalMatriculados }))
          .sort((a, b) => b.totalMatriculados - a.totalMatriculados);

        this.indicadoresPorCurso.set(indicadores);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los indicadores.');
        this.cargando.set(false);
      }
    });
  }

  calcularAnchoBarra(total: number): number {
    return (total / this.maximoMatriculados()) * 100;
  }
}