import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocenteService } from '../dashboard/services/docente.service';
import { Horario } from '../dashboard/models/horario.model';

const DIAS_SEMANA = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

@Component({
  selector: 'app-horarios-docente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './horarios-docente.html',
  styleUrl: './horarios-docente.css'
})
export class HorariosDocente implements OnInit {

  horarios = signal<Horario[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  diasConHorario = computed<{ dia: string; bloques: Horario[] }[]>(() => {
    const lista = this.horarios();
    const resultado: { dia: string; bloques: Horario[] }[] = [];

    for (let i = 1; i <= 6; i++) {
      const bloques = lista
        .filter(h => h.diaSemana === i)
        .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

      if (bloques.length > 0) {
        resultado.push({ dia: DIAS_SEMANA[i], bloques });
      }
    }

    return resultado;
  });

  constructor(private docenteService: DocenteService) {}

  ngOnInit(): void {
    this.cargarHorarios();
  }

  private cargarHorarios(): void {
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
            this.mensajeError.set('No se pudo cargar tu horario.');
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
}