import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CursoService } from './services/curso.service';
import { Curso } from './models/curso.model';

@Component({
  selector: 'app-cursos-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos-page.html',
  styleUrl: './cursos-page.css'
})
export class CursosPage implements OnInit {

  cursos = signal<Curso[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);
  textoBusqueda = signal<string>('');

  cursosFiltrados = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    if (!texto) {
      return this.cursos();
    }
    return this.cursos().filter(c =>
      c.nombre.toLowerCase().includes(texto) ||
      c.codigoCurso.toLowerCase().includes(texto)
    );
  });

  constructor(private cursoService: CursoService) {}

  ngOnInit(): void {
    this.cargarCursos();
  }

  private cargarCursos(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.cursoService.listarActivos().subscribe({
      next: (cursos) => {
        this.cursos.set(cursos);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los cursos. Intenta nuevamente.');
        this.cargando.set(false);
      }
    });
  }

  onBusquedaChange(valor: string): void {
    this.textoBusqueda.set(valor);
  }
}