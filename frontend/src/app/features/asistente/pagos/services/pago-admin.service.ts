import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PagoAdmin } from '../models/pago-admin.model';

@Injectable({
  providedIn: 'root'
})
export class PagoAdminService {

  private apiUrl = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<PagoAdmin[]> {
    return this.http.get<PagoAdmin[]>(this.apiUrl);
  }
}