import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Evaluacion, EvaluacionRequest } from '../models/evaluacion.model';
import { MatriculaCurso } from '../models/nota-estudiante.model';

interface CalificacionRequest {
  idMatricula: string;
  idEvaluacion: string;
  nota: number;
}

interface CalificacionResponse {
  idCalificacion: string;
  nombreEstudiante: string;
  nombreEvaluacion: string;
  nota: number;
  fechaRegistro: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalificacionDocenteService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarEvaluacionesPorCurso(idCurso: string): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(`${this.apiUrl}/evaluaciones/curso/${idCurso}`);
  }

  crearEvaluacion(request: EvaluacionRequest): Observable<Evaluacion> {
    return this.http.post<Evaluacion>(`${this.apiUrl}/evaluaciones`, request);
  }

  listarMatriculasPorHorario(idHorario: string): Observable<MatriculaCurso[]> {
    return this.http.get<MatriculaCurso[]>(`${this.apiUrl}/matriculas/horario/${idHorario}`);
  }

  registrarNota(request: CalificacionRequest): Observable<CalificacionResponse> {
    return this.http.post<CalificacionResponse>(`${this.apiUrl}/calificaciones`, request);
  }
}