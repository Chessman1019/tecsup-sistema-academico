import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private apiUrl = `${environment.apiUrl}/usuarios/me/foto`;

  /** Foto de perfil del usuario actual (base64), null si no tiene */
  fotoActual = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  cargarFoto(): void {
    this.http.get<{ foto: string }>(this.apiUrl).subscribe({
      next: (res) => this.fotoActual.set(res.foto ? res.foto : null),
      error: () => this.fotoActual.set(null)
    });
  }

  actualizarFoto(foto: string): Observable<void> {
    return this.http.put<void>(this.apiUrl, { foto }).pipe(
      tap(() => this.fotoActual.set(foto))
    );
  }

  limpiar(): void {
    this.fotoActual.set(null);
  }
}