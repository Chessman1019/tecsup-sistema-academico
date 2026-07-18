import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatriculaService } from '../matricula/services/matricula.service';
import { Matricula } from '../matricula/models/matricula.model';

const DIAS_SEMANA = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

interface BloqueHorario {
    idMatricula: string;
    nombreCurso: string;
    codigoCurso: string;
    nombreDocente: string;
    codigoAula: string;
    horaInicio: string;
    horaFin: string;
}

@Component({
    selector: 'app-horario-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './horario-page.html',
    styleUrl: './horario-page.css'
})
export class HorarioPage implements OnInit {

    matriculas = signal<Matricula[]>([]);
    cargando = signal(false);
    mensajeError = signal<string | null>(null);

    diasConHorario = computed<{ dia: string; bloques: BloqueHorario[] }[]>(() => {
        const activas = this.matriculas().filter(m => m.estado === 'Activo' || m.estado === 'Aprobado');
        const resultado: { dia: string; bloques: BloqueHorario[] }[] = [];

        for (let i = 1; i <= 6; i++) {
            const bloques = activas
                .filter((m) => m.diaSemana === i)
                .map((m) => ({
                    idMatricula: m.idMatricula,
                    nombreCurso: m.nombreCurso,
                    codigoCurso: m.codigoCurso,
                    nombreDocente: m.nombreDocente,
                    codigoAula: m.codigoAula,
                    horaInicio: m.horaInicio,
                    horaFin: m.horaFin
                }))
                .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

            if (bloques.length > 0) {
                resultado.push({ dia: DIAS_SEMANA[i], bloques });
            }
        }

        return resultado;
    });

    constructor(private matriculaService: MatriculaService) { }

    ngOnInit(): void {
        this.cargarHorario();
    }

    private cargarHorario(): void {
        this.cargando.set(true);
        this.mensajeError.set(null);

        this.matriculaService.obtenerMiPerfil().subscribe({
            next: (estudiante) => {
                this.matriculaService.listarMisMatriculas(estudiante.idEstudiante).subscribe({
                    next: (matriculas) => {
                        this.matriculas.set(matriculas);
                        this.cargando.set(false);
                    },
                    error: () => {
                        this.mensajeError.set('No se pudo cargar tu horario.');
                        this.cargando.set(false);
                    }
                });
            },
            error: () => {
                this.mensajeError.set('No se pudo cargar tu perfil de estudiante.');
                this.cargando.set(false);
            }
        });
    }
}