import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Auditoria } from '../models/auditoria.model';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  private apiUrl = `${environment.apiUrl}/auditoria`;

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Auditoria[]> {
    return this.http.get<Auditoria[]>(this.apiUrl);
  }
}