import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Horario } from '../../dashboard/models/horario.model';
import { MatriculaCurso } from '../../calificaciones/models/nota-estudiante.model';
import { ResumenCurso, ResumenEstudiante } from '../models/reportes-docente.model';

interface PorcentajeAsistenciaResponse {
  porcentajeAsistencia: number;
  enRiesgo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReportesDocenteService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private listarMatriculasPorHorario(idHorario: string): Observable<MatriculaCurso[]> {
    return this.http.get<MatriculaCurso[]>(`${this.apiUrl}/matriculas/horario/${idHorario}`);
  }

  private obtenerPromedio(idMatricula: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/calificaciones/matricula/${idMatricula}/promedio`);
  }

  private obtenerPorcentajeAsistencia(idMatricula: string): Observable<PorcentajeAsistenciaResponse> {
    return this.http.get<PorcentajeAsistenciaResponse>(`${this.apiUrl}/asistencias/matricula/${idMatricula}/porcentaje`);
  }

  obtenerResumenPorHorario(horario: Horario): Observable<ResumenCurso> {
    return this.listarMatriculasPorHorario(horario.idHorario).pipe(
      map(matriculas => matriculas.filter(m => m.estado === 'Activo' || m.estado === 'Aprobado')),
      map(matriculasActivas => {
        if (matriculasActivas.length === 0) {
          return { matriculas: matriculasActivas, peticiones: [] as Observable<[number, PorcentajeAsistenciaResponse]>[] };
        }
        const peticiones = matriculasActivas.map(m =>
          forkJoin([
            this.obtenerPromedio(m.idMatricula),
            this.obtenerPorcentajeAsistencia(m.idMatricula)
          ])
        );
        return { matriculas: matriculasActivas, peticiones };
      }),
      // Encadenamos el forkJoin de las peticiones internas
      map(({ matriculas, peticiones }) => ({ matriculas, peticiones })),
      // Usamos switchMap-like manual via forkJoin final
      (source) => new Observable<ResumenCurso>(observer => {
        source.subscribe({
          next: ({ matriculas, peticiones }) => {
            if (peticiones.length === 0) {
              observer.next({
                idCurso: horario.idCurso,
                idHorario: horario.idHorario,
                nombreCurso: horario.nombreCurso,
                estudiantes: [],
                promedioGeneral: 0,
                asistenciaPromedio: 0
              });
              observer.complete();
              return;
            }

            forkJoin(peticiones).subscribe({
              next: (resultados) => {
                const estudiantes: ResumenEstudiante[] = matriculas.map((m, i) => {
                  const [promedio, asistencia] = resultados[i];
                  return {
                    idMatricula: m.idMatricula,
                    codigoAlumno: m.codigoAlumno,
                    nombreEstudiante: m.nombreCompletoEstudiante,
                    promedio,
                    porcentajeAsistencia: asistencia.porcentajeAsistencia,
                    enRiesgoAcademico: promedio < 11,
                    enRiesgoAsistencia: asistencia.enRiesgo
                  };
                });

                const promedioGeneral = estudiantes.reduce((s, e) => s + e.promedio, 0) / estudiantes.length;
                const asistenciaPromedio = estudiantes.reduce((s, e) => s + e.porcentajeAsistencia, 0) / estudiantes.length;

                observer.next({
                  idCurso: horario.idCurso,
                  idHorario: horario.idHorario,
                  nombreCurso: horario.nombreCurso,
                  estudiantes,
                  promedioGeneral,
                  asistenciaPromedio
                });
                observer.complete();
              },
              error: (err) => observer.error(err)
            });
          },
          error: (err) => observer.error(err)
        });
      })
    );
  }
}