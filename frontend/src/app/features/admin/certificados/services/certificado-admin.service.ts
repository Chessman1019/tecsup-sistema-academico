import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CertificadoAdmin } from '../models/certificado-admin.model';

@Injectable({
  providedIn: 'root'
})
export class CertificadoAdminService {

  private apiUrl = `${environment.apiUrl}/certificados`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<CertificadoAdmin[]> {
    return this.http.get<CertificadoAdmin[]>(this.apiUrl);
  }

  emitir(idCertificado: string, urlDoc: string): Observable<CertificadoAdmin> {
    const params = new URLSearchParams({ urlDoc }).toString();
    return this.http.patch<CertificadoAdmin>(`${this.apiUrl}/${idCertificado}/emitir?${params}`, {});
  }
}