import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Programa, ProgramaRequest } from '../models/programa.model';
import { Carrera } from '../../carreras/models/carrera.model';

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {

  private apiUrl = `${environment.apiUrl}/programas`;
  private apiUrlCarreras = `${environment.apiUrl}/carreras`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Programa[]> {
    return this.http.get<Programa[]>(this.apiUrl);
  }

  listarCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.apiUrlCarreras);
  }

  crear(request: ProgramaRequest): Observable<Programa> {
    return this.http.post<Programa>(this.apiUrl, request);
  }

  cambiarEstado(idPrograma: string, estado: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${idPrograma}/estado`, { estado });
  }
}