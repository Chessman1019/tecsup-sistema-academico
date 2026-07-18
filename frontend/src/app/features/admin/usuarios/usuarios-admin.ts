import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioAdminService } from './services/usuario-admin.service';
import { Usuario } from './models/usuario.model';
import { ModalConfirmacion } from '../../../shared/components/modal-confirmacion/modal-confirmacion';

const ROLES_DISPONIBLES = [
  'ESTUDIANTE',
  'DOCENTE',
  'ASISTENTE_REGISTRO',
  'COORDINADOR_ACADEMICO',
  'JEFE_GESTION_ACADEMICA',
  'ADMIN'
];

const ETIQUETA_ROL: Record<string, string> = {
  ESTUDIANTE: 'Estudiante',
  DOCENTE: 'Docente',
  ASISTENTE_REGISTRO: 'Asistente de Registro',
  COORDINADOR_ACADEMICO: 'Coordinador Académico',
  JEFE_GESTION_ACADEMICA: 'Jefe de Gestión Académica',
  ADMIN: 'Administrador'
};

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalConfirmacion],
  templateUrl: './usuarios-admin.html',
  styleUrl: './usuarios-admin.css'
})
export class UsuariosAdmin implements OnInit {

  rolesDisponibles = ROLES_DISPONIBLES;

  usuarios = signal<Usuario[]>([]);
  cargando = signal(false);
  guardando = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  mostrandoForm = signal(false);
  editandoIdUsuario = signal<string | null>(null);

  textoBusqueda = signal<string>('');

  usernameNuevo = signal<string>('');
  passwordNuevo = signal<string>('');
  rolNuevo = signal<string>('ESTUDIANTE');

  // Modales de confirmación
  usuarioACambiarEstado = signal<Usuario | null>(null);
  cambiandoEstado = signal(false);

  usuarioAEliminar = signal<Usuario | null>(null);
  eliminando = signal(false);

  usuariosFiltrados = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    if (!texto) return this.usuarios();
    return this.usuarios().filter(u =>
      u.username.toLowerCase().includes(texto) ||
      u.rol.toLowerCase().includes(texto)
    );
  });

  constructor(private usuarioAdminService: UsuarioAdminService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  private cargarUsuarios(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.usuarioAdminService.listarTodos().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los usuarios.');
        this.cargando.set(false);
      }
    });
  }

  etiquetaRol(rol: string): string {
    return ETIQUETA_ROL[rol] ?? rol;
  }

  onBusquedaChange(valor: string): void {
    this.textoBusqueda.set(valor);
  }

  abrirFormNuevo(): void {
    this.editandoIdUsuario.set(null);
    this.usernameNuevo.set('');
    this.passwordNuevo.set('');
    this.rolNuevo.set('ESTUDIANTE');
    this.mostrandoForm.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  abrirFormEditar(usuario: Usuario): void {
    this.editandoIdUsuario.set(usuario.idUsuario);
    this.usernameNuevo.set(usuario.username);
    this.passwordNuevo.set('');
    this.rolNuevo.set(usuario.rol);
    this.mostrandoForm.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  cancelarForm(): void {
    this.mostrandoForm.set(false);
    this.editandoIdUsuario.set(null);
  }

  guardar(): void {
    const username = this.usernameNuevo();
    const password = this.passwordNuevo();
    const rol = this.rolNuevo();
    const idEditando = this.editandoIdUsuario();

    if (!username || !rol) {
      this.mensajeError.set('Completa el username y el rol.');
      return;
    }

    if (!idEditando && !password) {
      this.mensajeError.set('La contraseña es obligatoria al crear un usuario nuevo.');
      return;
    }

    this.guardando.set(true);
    this.mensajeError.set(null);

    const request = {
      username,
      password: password || undefined,
      nombreRol: rol
    };

    const peticion = idEditando
      ? this.usuarioAdminService.actualizar(idEditando, request)
      : this.usuarioAdminService.crear(request);

    peticion.subscribe({
      next: () => {
        this.mensajeExito.set(idEditando ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.');
        this.mostrandoForm.set(false);
        this.editandoIdUsuario.set(null);
        this.cargarUsuarios();
        this.guardando.set(false);
      },
      error: (err) => {
        this.mensajeError.set(err.error?.message || 'No se pudo guardar el usuario.');
        this.guardando.set(false);
      }
    });
  }

  // ---------- Cambiar estado (con confirmación) ----------

  pedirCambioEstado(usuario: Usuario): void {
    this.usuarioACambiarEstado.set(usuario);
  }

  confirmarCambioEstado(): void {
    const usuario = this.usuarioACambiarEstado();
    if (!usuario) return;

    this.cambiandoEstado.set(true);

    this.usuarioAdminService.cambiarEstado(usuario.idUsuario, !usuario.estado).subscribe({
      next: () => {
        this.mensajeExito.set(
          usuario.estado
            ? `Usuario "${usuario.username}" desactivado.`
            : `Usuario "${usuario.username}" activado.`
        );
        this.usuarioACambiarEstado.set(null);
        this.cambiandoEstado.set(false);
        this.cargarUsuarios();
      },
      error: () => {
        this.mensajeError.set('No se pudo cambiar el estado del usuario.');
        this.usuarioACambiarEstado.set(null);
        this.cambiandoEstado.set(false);
      }
    });
  }

  // ---------- Eliminar (con confirmación) ----------

  pedirEliminacion(usuario: Usuario): void {
    this.usuarioAEliminar.set(usuario);
  }

  confirmarEliminacion(): void {
    const usuario = this.usuarioAEliminar();
    if (!usuario) return;

    this.eliminando.set(true);

    this.usuarioAdminService.eliminar(usuario.idUsuario).subscribe({
      next: () => {
        this.mensajeExito.set(`Usuario "${usuario.username}" eliminado.`);
        this.usuarioAEliminar.set(null);
        this.eliminando.set(false);
        this.cargarUsuarios();
      },
      error: (err) => {
        this.mensajeError.set(err.error?.message || 'No se pudo eliminar el usuario (puede tener registros asociados).');
        this.usuarioAEliminar.set(null);
        this.eliminando.set(false);
      }
    });
  }
}