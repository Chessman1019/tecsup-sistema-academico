import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaDocenteService } from './services/asistencia-docente.service';
import { DocenteService } from '../dashboard/services/docente.service';
import { Horario } from '../dashboard/models/horario.model';
import { Sesion } from './models/sesion.model';
import { MatriculaEstudiante, RegistroAsistenciaItem } from './models/matricula-estudiante.model';

@Component({
  selector: 'app-asistencia-docente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asistencia-docente.html',
  styleUrl: './asistencia-docente.css'
})
export class AsistenciaDocente implements OnInit {

  horarios = signal<Horario[]>([]);
  horarioSeleccionado = signal<Horario | null>(null);
  sesionActual = signal<Sesion | null>(null);
  registros = signal<RegistroAsistenciaItem[]>([]);

  cargandoHorarios = signal(false);
  cargandoRegistros = signal(false);
  guardando = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  totalPresentes = computed(() => this.registros().filter(r => r.estado === 'P').length);
  totalAusentes = computed(() => this.registros().filter(r => r.estado === 'A').length);
  totalTardanzas = computed(() => this.registros().filter(r => r.estado === 'T').length);
  totalPendientes = computed(() => this.registros().filter(r => r.estado === null).length);

  constructor(
    private asistenciaService: AsistenciaDocenteService,
    private docenteService: DocenteService
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
            this.horarios.set(horarios);
            this.cargandoHorarios.set(false);
          },
          error: () => this.cargandoHorarios.set(false)
        });
      },
      error: () => this.cargandoHorarios.set(false)
    });
  }

  seleccionarHorario(horario: Horario): void {
    this.horarioSeleccionado.set(horario);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
    this.cargarSesionYEstudiantes(horario.idHorario);
  }

  private cargarSesionYEstudiantes(idHorario: string): void {
    this.cargandoRegistros.set(true);
    this.registros.set([]);

    this.asistenciaService.obtenerSesionDeHoy(idHorario).subscribe({
      next: (sesion) => {
        this.sesionActual.set(sesion);

        this.asistenciaService.listarMatriculasPorHorario(idHorario).subscribe({
          next: (matriculas) => {
            const activas = matriculas.filter(m => m.estado === 'Activo' || m.estado === 'Aprobado');

            this.asistenciaService.listarAsistenciaPorSesion(sesion.idSesion).subscribe({
              next: (asistenciasExistentes) => {
                const items: RegistroAsistenciaItem[] = activas.map(m => {
                  const existente = asistenciasExistentes.find(a => a.nombreEstudiante === m.nombreCompletoEstudiante);
                  return {
                    idMatricula: m.idMatricula,
                    nombreEstudiante: m.nombreCompletoEstudiante,
                    codigoAlumno: m.codigoAlumno,
                    estado: existente ? (existente.estado as 'P' | 'A' | 'T') : null,
                    idRegistroExistente: existente ? existente.idRegistro : null
                  };
                });
                this.registros.set(items);
                this.cargandoRegistros.set(false);
              },
              error: () => this.cargandoRegistros.set(false)
            });
          },
          error: () => {
            this.mensajeError.set('No se pudieron cargar los estudiantes matriculados.');
            this.cargandoRegistros.set(false);
          }
        });
      },
      error: () => {
        this.mensajeError.set('No se pudo obtener la sesión de hoy.');
        this.cargandoRegistros.set(false);
      }
    });
  }

  marcarEstado(idMatricula: string, estado: 'P' | 'A' | 'T'): void {
    this.registros.update(lista =>
      lista.map(r => r.idMatricula === idMatricula ? { ...r, estado } : r)
    );
  }

  marcarTodosPresentes(): void {
    this.registros.update(lista => lista.map(r => ({ ...r, estado: 'P' as const })));
  }

  guardarAsistencia(): void {
    const sesion = this.sesionActual();
    if (!sesion) return;

    const pendientes = this.registros().filter(r => r.estado !== null);
    if (pendientes.length === 0) {
      this.mensajeError.set('Marca al menos un estudiante antes de guardar.');
      return;
    }

    this.guardando.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    let completados = 0;
    let huboError = false;

    pendientes.forEach(item => {
      this.asistenciaService.registrarAsistencia({
        idMatricula: item.idMatricula,
        idSesion: sesion.idSesion,
        estado: item.estado as string
      }).subscribe({
        next: () => {
          completados++;
          if (completados === pendientes.length && !huboError) {
            this.mensajeExito.set('Asistencia registrada correctamente.');
            this.guardando.set(false);
          }
        },
        error: () => {
          huboError = true;
          this.mensajeError.set('Ocurrió un error al guardar algunos registros.');
          this.guardando.set(false);
        }
      });
    });
  }
}