import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Certificado, CertificadoRequest } from '../models/certificado.model';

@Injectable({
  providedIn: 'root'
})
export class CertificadoService {

  private apiUrl = `${environment.apiUrl}/certificados`;

  constructor(private http: HttpClient) {}

  listarPorEstudiante(idEstudiante: string): Observable<Certificado[]> {
    return this.http.get<Certificado[]>(`${this.apiUrl}/estudiante/${idEstudiante}`);
  }

  solicitar(request: CertificadoRequest): Observable<Certificado> {
    return this.http.post<Certificado>(this.apiUrl, request);
  }
}