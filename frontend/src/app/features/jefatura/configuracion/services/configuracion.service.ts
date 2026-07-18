import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Configuracion, ConfiguracionRequest } from '../models/configuracion.model';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  private apiUrl = `${environment.apiUrl}/configuracion`;

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Configuracion[]> {
    return this.http.get<Configuracion[]>(this.apiUrl);
  }

  actualizarValor(idConfiguracion: string, request: ConfiguracionRequest): Observable<Configuracion> {
    return this.http.put<Configuracion>(`${this.apiUrl}/${idConfiguracion}`, request);
  }
}