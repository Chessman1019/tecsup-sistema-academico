import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface RolTab {
  clave: string;
  etiqueta: string;
}

interface SlideCarrusel {
  imagen: string;
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit, OnDestroy {

  roles: RolTab[] = [
    { clave: 'ADMIN', etiqueta: 'Admin' },
    { clave: 'ESTUDIANTE', etiqueta: 'Estudiante' },
    { clave: 'DOCENTE', etiqueta: 'Docente' },
    { clave: 'ASISTENTE_REGISTRO', etiqueta: 'Asistente' },
    { clave: 'COORDINADOR_ACADEMICO', etiqueta: 'Coordinador' },
    { clave: 'JEFE_GESTION_ACADEMICA', etiqueta: 'Jefatura' }
  ];

  slides: SlideCarrusel[] = [
    {
      imagen: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
      titulo: 'Formando técnicos y tecnólogos de excelencia',
      descripcion: 'Educación de calidad con enfoque práctico en tecnología e innovación.'
    },
    {
      imagen: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
      titulo: 'Laboratorios equipados con tecnología de punta',
      descripcion: 'Aprende con las mismas herramientas que usarás en tu vida profesional.'
    },
    {
      imagen: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
      titulo: 'Una comunidad enfocada en tu futuro',
      descripcion: 'Acompañamiento académico personalizado durante toda tu carrera.'
    }
  ];

  slideActual = signal(0);
  private intervaloCarrusel: any;

  rolSeleccionado = signal<string>('ESTUDIANTE');

  username = '';
  password = '';
  mostrarPassword = signal(false);
  cargando = signal(false);
  errorMensaje = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.intervaloCarrusel = setInterval(() => {
      this.slideActual.update(actual => (actual + 1) % this.slides.length);
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervaloCarrusel) {
      clearInterval(this.intervaloCarrusel);
    }
  }

  irASlide(indice: number): void {
    this.slideActual.set(indice);
  }

  seleccionarRol(clave: string): void {
    this.rolSeleccionado.set(clave);
    this.errorMensaje.set(null);
  }

  togglePassword(): void {
    this.mostrarPassword.update(v => !v);
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMensaje.set('Por favor ingresa usuario y contraseña.');
      return;
    }

    this.cargando.set(true);
    this.errorMensaje.set(null);

    this.authService.login({
      username: this.username,
      password: this.password,
      rol: this.rolSeleccionado()
    }).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        this.cargando.set(false);
        this.errorMensaje.set(
          err.error?.message || 'Usuario o contraseña incorrectos.'
        );
      }
    });
  }
}