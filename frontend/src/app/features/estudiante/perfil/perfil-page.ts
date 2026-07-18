import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatriculaService } from '../matricula/services/matricula.service';
import { Estudiante } from '../matricula/models/estudiante.model';
import { AuthService } from '../../../core/services/auth.service';
import { PerfilService } from '../../../core/services/perfil.service';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-page.html',
  styleUrl: './perfil-page.css'
})
export class PerfilPage implements OnInit {

  perfil = signal<Estudiante | null>(null);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  subiendoFoto = signal(false);
  errorFoto = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  constructor(
    private matriculaService: MatriculaService,
    public authService: AuthService,
    public perfilService: PerfilService
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
    this.perfilService.cargarFoto();
  }

  private cargarPerfil(): void {
    this.cargando.set(true);
    this.matriculaService.obtenerMiPerfil().subscribe({
      next: (estudiante) => {
        this.perfil.set(estudiante);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudo cargar tu información personal.');
        this.cargando.set(false);
      }
    });
  }

  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = '';

    if (!archivo) return;

    this.errorFoto.set(null);
    this.mensajeExito.set(null);

    if (!archivo.type.startsWith('image/')) {
      this.errorFoto.set('El archivo debe ser una imagen.');
      return;
    }

    if (archivo.size > 500 * 1024) {
      this.errorFoto.set('La imagen no debe superar los 500 KB.');
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      const base64 = lector.result as string;
      this.subiendoFoto.set(true);

      this.perfilService.actualizarFoto(base64).subscribe({
        next: () => {
          this.subiendoFoto.set(false);
          this.mensajeExito.set('Foto de perfil actualizada correctamente.');
        },
        error: (err) => {
          this.subiendoFoto.set(false);
          this.errorFoto.set(err.error?.message || 'No se pudo subir la imagen.');
        }
      });
    };
    lector.readAsDataURL(archivo);
  }
}