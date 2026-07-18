import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Sede, SedeRequest } from '../models/sede.model';

@Injectable({
  providedIn: 'root'
})
export class SedeService {

  private apiUrl = `${environment.apiUrl}/sedes`;

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Sede[]> {
    return this.http.get<Sede[]>(this.apiUrl);
  }

  crear(request: SedeRequest): Observable<Sede> {
    return this.http.post<Sede>(this.apiUrl, request);
  }

  actualizar(idSede: string, request: SedeRequest): Observable<Sede> {
    return this.http.put<Sede>(`${this.apiUrl}/${idSede}`, request);
  }

  cambiarEstado(idSede: string, estado: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${idSede}/estado`, { estado });
  }
}