import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocenteService } from '../dashboard/services/docente.service';
import { ReportesDocenteService } from './services/reportes-docente.service';
import { Horario } from '../dashboard/models/horario.model';
import { ResumenCurso } from './models/reportes-docente.model';

@Component({
  selector: 'app-reportes-docente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes-docente.html',
  styleUrl: './reportes-docente.css'
})
export class ReportesDocente implements OnInit {

  horarios = signal<Horario[]>([]);
  horarioSeleccionado = signal<Horario | null>(null);
  resumen = signal<ResumenCurso | null>(null);

  cargandoHorarios = signal(false);
  cargandoResumen = signal(false);
  mensajeError = signal<string | null>(null);

  constructor(
    private docenteService: DocenteService,
    private reportesService: ReportesDocenteService
  ) {}

  ngOnInit(): void {
    this.cargarHorarios();
  }

  private cargarHorarios(): void {
    this.cargandoHorarios.set(true);
    this.docenteService.obtenerMiPerfil().subscribe({
      next: (docente) => {
        this.docenteService.listarMisHorarios(docente.idDocente).subscribe({
          next: (horarios) => {
            // Solo un horario por curso, para no repetir reportes del mismo curso
            const mapa = new Map(horarios.map(h => [h.idCurso, h]));
            this.horarios.set(Array.from(mapa.values()));
            this.cargandoHorarios.set(false);
          },
          error: () => this.cargandoHorarios.set(false)
        });
      },
      error: () => {
        this.mensajeError.set('No se pudo cargar tu perfil de docente.');
        this.cargandoHorarios.set(false);
      }
    });
  }

  seleccionarCurso(horario: Horario): void {
    this.horarioSeleccionado.set(horario);
    this.resumen.set(null);
    this.mensajeError.set(null);
    this.cargandoResumen.set(true);

    this.reportesService.obtenerResumenPorHorario(horario).subscribe({
      next: (resumen) => {
        this.resumen.set(resumen);
        this.cargandoResumen.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudo generar el reporte de este curso.');
        this.cargandoResumen.set(false);
      }
    });
  }
}