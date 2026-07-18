import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Rol } from '../models/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl);
  }
}