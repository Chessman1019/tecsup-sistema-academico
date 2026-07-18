import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Docente } from '../models/docente.model';
import { Horario } from '../models/horario.model';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerMiPerfil(): Observable<Docente> {
    return this.http.get<Docente>(`${this.apiUrl}/docentes/me`);
  }

  listarMisHorarios(idDocente: string): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/horarios/docente/${idDocente}`);
  }
}