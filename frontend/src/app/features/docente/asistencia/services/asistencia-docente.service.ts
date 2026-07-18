import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Sesion } from '../models/sesion.model';
import { MatriculaEstudiante } from '../models/matricula-estudiante.model';

interface AsistenciaRequest {
  idMatricula: string;
  idSesion: string;
  estado: string;
  observacion?: string;
}

interface AsistenciaResponse {
  idRegistro: string;
  nombreEstudiante: string;
  fecha: string;
  estado: string;
  observacion: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AsistenciaDocenteService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerSesionDeHoy(idHorario: string): Observable<Sesion> {
    return this.http.post<Sesion>(`${this.apiUrl}/sesiones/horario/${idHorario}/hoy`, {});
  }

  listarMatriculasPorHorario(idHorario: string): Observable<MatriculaEstudiante[]> {
    return this.http.get<MatriculaEstudiante[]>(`${this.apiUrl}/matriculas/horario/${idHorario}`);
  }

  listarAsistenciaPorSesion(idSesion: string): Observable<AsistenciaResponse[]> {
    return this.http.get<AsistenciaResponse[]>(`${this.apiUrl}/asistencias/sesion/${idSesion}`);
  }

  registrarAsistencia(request: AsistenciaRequest): Observable<AsistenciaResponse> {
    return this.http.post<AsistenciaResponse>(`${this.apiUrl}/asistencias`, request);
  }
}