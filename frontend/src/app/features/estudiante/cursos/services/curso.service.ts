import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Curso } from '../models/curso.model';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private apiUrl = `${environment.apiUrl}/cursos`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  listarActivos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/activos`);
  }
}