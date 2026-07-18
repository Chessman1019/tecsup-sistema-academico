import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { DocenteListado, Curso } from '../models/coordinador.model';

@Injectable({
  providedIn: 'root'
})
export class CoordinadorService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarTodosLosDocentes(): Observable<DocenteListado[]> {
    return this.http.get<DocenteListado[]>(`${this.apiUrl}/docentes`);
  }

  listarTodosLosCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/cursos`);
  }
}