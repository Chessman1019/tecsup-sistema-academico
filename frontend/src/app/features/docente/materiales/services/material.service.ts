import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Material, MaterialRequest } from '../models/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private apiUrl = `${environment.apiUrl}/materiales`;

  constructor(private http: HttpClient) {}

  listarPorDocente(idDocente: string): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/docente/${idDocente}`);
  }

  crear(request: MaterialRequest): Observable<Material> {
    return this.http.post<Material>(this.apiUrl, request);
  }

  eliminar(idMaterial: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idMaterial}`);
  }
}