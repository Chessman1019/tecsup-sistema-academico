import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Periodo, PeriodoRequest } from '../models/periodo.model';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {

  private apiUrl = `${environment.apiUrl}/periodos-academicos`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(this.apiUrl);
  }

  crear(request: PeriodoRequest): Observable<Periodo> {
    return this.http.post<Periodo>(this.apiUrl, request);
  }

  actualizar(idPeriodo: string, request: PeriodoRequest): Observable<Periodo> {
    return this.http.put<Periodo>(`${this.apiUrl}/${idPeriodo}`, request);
  }
}