import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { EstudianteListado } from '../models/estudiante-listado.model';

@Injectable({
  providedIn: 'root'
})
export class AsistenteService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarTodosLosEstudiantes(): Observable<EstudianteListado[]> {
    return this.http.get<EstudianteListado[]>(`${this.apiUrl}/estudiantes`);
  }
}