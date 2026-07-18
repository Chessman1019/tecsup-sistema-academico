import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Carrera, CarreraRequest } from '../models/carrera.model';
import { Sede } from '../../sedes/models/sede.model';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  private apiUrl = `${environment.apiUrl}/carreras`;
  private apiUrlSedes = `${environment.apiUrl}/sedes`;

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.apiUrl);
  }

  listarSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(this.apiUrlSedes);
  }

  crear(request: CarreraRequest): Observable<Carrera> {
    return this.http.post<Carrera>(this.apiUrl, request);
  }

  actualizar(idCarrera: string, request: CarreraRequest): Observable<Carrera> {
    return this.http.put<Carrera>(`${this.apiUrl}/${idCarrera}`, request);
  }

  cambiarEstado(idCarrera: string, estado: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${idCarrera}/estado`, { estado });
  }
}