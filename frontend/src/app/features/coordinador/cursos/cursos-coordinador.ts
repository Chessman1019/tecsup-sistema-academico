import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CursoAdminService } from './services/curso-admin.service';
import { CursoAdmin } from './models/curso-admin.model';
import { ModalConfirmacion } from '../../../shared/components/modal-confirmacion/modal-confirmacion';

@Component({
  selector: 'app-cursos-coordinador',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalConfirmacion],
  templateUrl: './cursos-coordinador.html',
  styleUrl: './cursos-coordinador.css'
})
export class CursosCoordinador implements OnInit {

  cursos = signal<CursoAdmin[]>([]);
  cargando = signal(false);
  guardando = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  mostrandoForm = signal(false);
  editandoIdCurso = signal<string | null>(null);

  textoBusqueda = signal<string>('');

  codigoCurso = signal<string>('');
  nombreCurso = signal<string>('');
  creditos = signal<number | null>(null);
  horasSemanales = signal<number | null>(null);

  // Confirmación de cambio de estado
  cursoACambiarEstado = signal<CursoAdmin | null>(null);
  cambiandoEstado = signal(false);

  cursosFiltrados = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    if (!texto) return this.cursos();
    return this.cursos().filter(c =>
      c.nombre.toLowerCase().includes(texto) ||
      c.codigoCurso.toLowerCase().includes(texto)
    );
  });

  constructor(private cursoAdminService: CursoAdminService) {}

  ngOnInit(): void {
    this.cargarCursos();
  }

  private cargarCursos(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.cursoAdminService.listarTodos().subscribe({
      next: (cursos) => {
        this.cursos.set(cursos);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los cursos.');
        this.cargando.set(false);
      }
    });
  }

  onBusquedaChange(valor: string): void {
    this.textoBusqueda.set(valor);
  }

  abrirFormNuevo(): void {
    this.editandoIdCurso.set(null);
    this.codigoCurso.set('');
    this.nombreCurso.set('');
    this.creditos.set(null);
    this.horasSemanales.set(null);
    this.mostrandoForm.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  abrirFormEditar(curso: CursoAdmin): void {
    this.editandoIdCurso.set(curso.idCurso);
    this.codigoCurso.set(curso.codigoCurso);
    this.nombreCurso.set(curso.nombre);
    this.creditos.set(curso.creditos);
    this.horasSemanales.set(curso.horasSemanales);
    this.mostrandoForm.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  cancelarForm(): void {
    this.mostrandoForm.set(false);
    this.editandoIdCurso.set(null);
  }

  guardar(): void {
    const codigo = this.codigoCurso();
    const nombre = this.nombreCurso();
    const creditos = this.creditos();
    const horas = this.horasSemanales();

    if (!codigo || !nombre || creditos === null || horas === null) {
      this.mensajeError.set('Completa todos los campos antes de guardar.');
      return;
    }

    this.guardando.set(true);
    this.mensajeError.set(null);

    const request = {
      codigoCurso: codigo,
      nombre,
      creditos,
      horasSemanales: horas
    };

    const idEditando = this.editandoIdCurso();

    const peticion = idEditando
      ? this.cursoAdminService.actualizar(idEditando, request)
      : this.cursoAdminService.crear(request);

    peticion.subscribe({
      next: () => {
        this.mensajeExito.set(idEditando ? 'Curso actualizado correctamente.' : 'Curso creado correctamente.');
        this.mostrandoForm.set(false);
        this.editandoIdCurso.set(null);
        this.cargarCursos();
        this.guardando.set(false);
      },
      error: (err) => {
        this.mensajeError.set(err.error?.message || 'No se pudo guardar el curso.');
        this.guardando.set(false);
      }
    });
  }

  // ---------- Cambiar estado (con confirmación) ----------

  pedirCambioEstado(curso: CursoAdmin): void {
    this.cursoACambiarEstado.set(curso);
  }

  confirmarCambioEstado(): void {
    const curso = this.cursoACambiarEstado();
    if (!curso) return;

    this.cambiandoEstado.set(true);

    this.cursoAdminService.cambiarEstado(curso.idCurso, !curso.estado).subscribe({
      next: () => {
        this.mensajeExito.set(
          curso.estado
            ? `Curso "${curso.nombre}" desactivado. Ya no estará disponible para matrícula.`
            : `Curso "${curso.nombre}" activado.`
        );
        this.cursoACambiarEstado.set(null);
        this.cambiandoEstado.set(false);
        this.cargarCursos();
      },
      error: () => {
        this.mensajeError.set('No se pudo cambiar el estado del curso.');
        this.cursoACambiarEstado.set(null);
        this.cambiandoEstado.set(false);
      }
    });
  }
}