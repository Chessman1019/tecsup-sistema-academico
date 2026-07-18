import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Documento } from '../models/documento.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  private apiUrl = `${environment.apiUrl}/documentos`;

  constructor(private http: HttpClient) {}

  obtenerMisDocumentos(): Observable<Documento[]> {
    return this.http.get<Documento[]>(`${this.apiUrl}/me`);
  }
}