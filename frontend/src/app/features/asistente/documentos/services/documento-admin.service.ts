import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { DocumentoAdmin } from '../models/documento-admin.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoAdminService {

  private apiUrl = `${environment.apiUrl}/documentos`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<DocumentoAdmin[]> {
    return this.http.get<DocumentoAdmin[]>(this.apiUrl);
  }
}