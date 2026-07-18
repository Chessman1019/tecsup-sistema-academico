import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Aula, AulaRequest } from '../models/aula.model';

@Injectable({
  providedIn: 'root'
})
export class AulaService {

  private apiUrl = `${environment.apiUrl}/aulas`;

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(this.apiUrl);
  }

  crear(request: AulaRequest): Observable<Aula> {
    return this.http.post<Aula>(this.apiUrl, request);
  }

  actualizar(idAula: string, request: AulaRequest): Observable<Aula> {
    return this.http.put<Aula>(`${this.apiUrl}/${idAula}`, request);
  }
}