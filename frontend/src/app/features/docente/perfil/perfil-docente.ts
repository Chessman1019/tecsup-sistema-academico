import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocenteService } from '../dashboard/services/docente.service';
import { Docente } from '../dashboard/models/docente.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-perfil-docente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-docente.html',
  styleUrl: './perfil-docente.css'
})
export class PerfilDocente implements OnInit {

  perfil = signal<Docente | null>(null);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  constructor(
    private docenteService: DocenteService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  private cargarPerfil(): void {
    this.cargando.set(true);
    this.docenteService.obtenerMiPerfil().subscribe({
      next: (docente) => {
        this.perfil.set(docente);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudo cargar tu información personal.');
        this.cargando.set(false);
      }
    });
  }
}