import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Incidencia, IncidenciaRequest } from '../models/incidencia.model';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {

  private apiUrl = `${environment.apiUrl}/incidencias`;

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(this.apiUrl);
  }

  crear(request: IncidenciaRequest): Observable<Incidencia> {
    return this.http.post<Incidencia>(this.apiUrl, request);
  }

  cambiarEstado(idIncidencia: string, estado: string): Observable<Incidencia> {
    return this.http.patch<Incidencia>(`${this.apiUrl}/${idIncidencia}/estado`, { estado });
  }
}