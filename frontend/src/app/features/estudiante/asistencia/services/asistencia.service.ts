import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { RegistroAsistencia, PorcentajeAsistencia } from '../models/asistencia.model';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private apiUrl = `${environment.apiUrl}/asistencias`;

  constructor(private http: HttpClient) {}

  listarPorMatricula(idMatricula: string): Observable<RegistroAsistencia[]> {
    return this.http.get<RegistroAsistencia[]>(`${this.apiUrl}/matricula/${idMatricula}`);
  }

  obtenerPorcentaje(idMatricula: string): Observable<PorcentajeAsistencia> {
    return this.http.get<PorcentajeAsistencia>(`${this.apiUrl}/matricula/${idMatricula}/porcentaje`);
  }
}