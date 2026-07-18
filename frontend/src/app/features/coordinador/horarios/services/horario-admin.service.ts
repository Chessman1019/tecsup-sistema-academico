import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HorarioAdmin, HorarioRequest, Aula } from '../models/horario-admin.model';

@Injectable({
  providedIn: 'root'
})
export class HorarioAdminService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<HorarioAdmin[]> {
    return this.http.get<HorarioAdmin[]>(`${this.apiUrl}/horarios`);
  }

  listarAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(`${this.apiUrl}/aulas`);
  }

  crear(request: HorarioRequest): Observable<HorarioAdmin> {
    return this.http.post<HorarioAdmin>(`${this.apiUrl}/horarios`, request);
  }
}