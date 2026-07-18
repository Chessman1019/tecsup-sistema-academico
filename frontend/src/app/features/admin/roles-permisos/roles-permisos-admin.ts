import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolService } from './services/rol.service';
import { Rol } from './models/rol.model';

interface PermisoDescripcion {
  modulo: string;
  acceso: string;
}

const PERMISOS_POR_ROL: Record<string, PermisoDescripcion[]> = {
  ESTUDIANTE: [
    { modulo: 'Matrícula', acceso: 'Registrar y consultar sus propias matrículas' },
    { modulo: 'Calificaciones', acceso: 'Solo lectura de sus propias notas' },
    { modulo: 'Asistencia', acceso: 'Solo lectura de su propia asistencia' },
    { modulo: 'Certificados', acceso: 'Solicitar certificados propios' }
  ],
  DOCENTE: [
    { modulo: 'Asistencia', acceso: 'Registrar asistencia de sus cursos' },
    { modulo: 'Calificaciones', acceso: 'Registrar notas de sus cursos' },
    { modulo: 'Evaluaciones', acceso: 'Crear evaluaciones de sus cursos' },
    { modulo: 'Materiales', acceso: 'Subir materiales de clase' }
  ],
  ASISTENTE_REGISTRO: [
    { modulo: 'Matrícula', acceso: 'Matricular estudiantes y gestionar inscripciones' },
    { modulo: 'Certificados', acceso: 'Emitir certificados solicitados' },
    { modulo: 'Estudiantes', acceso: 'Consultar registro de estudiantes' }
  ],
  COORDINADOR_ACADEMICO: [
    { modulo: 'Cursos', acceso: 'Crear, editar y desactivar cursos' },
    { modulo: 'Horarios', acceso: 'Programar horarios con detección de conflictos' },
    { modulo: 'Incidencias', acceso: 'Registrar y dar seguimiento a incidencias' }
  ],
  JEFE_GESTION_ACADEMICA: [
    { modulo: 'Aprobaciones', acceso: 'Aprobar o devolver incidencias escaladas' },
    { modulo: 'Reportes', acceso: 'Acceso a reportes institucionales completos' },
    { modulo: 'Indicadores', acceso: 'Visualización de indicadores generales' }
  ],
  ADMIN: [
    { modulo: 'Usuarios', acceso: 'Control total de cuentas del sistema' },
    { modulo: 'Todos los módulos', acceso: 'Acceso completo a todas las funcionalidades' }
  ]
};

const ETIQUETA_ROL: Record<string, string> = {
  ESTUDIANTE: 'Estudiante',
  DOCENTE: 'Docente',
  ASISTENTE_REGISTRO: 'Asistente de Registro',
  COORDINADOR_ACADEMICO: 'Coordinador Académico',
  JEFE_GESTION_ACADEMICA: 'Jefe de Gestión Académica',
  ADMIN: 'Administrador'
};

const ICONO_ROL: Record<string, string> = {
  ESTUDIANTE: '🎓',
  DOCENTE: '🧑‍🏫',
  ASISTENTE_REGISTRO: '📋',
  COORDINADOR_ACADEMICO: '🗂️',
  JEFE_GESTION_ACADEMICA: '📈',
  ADMIN: '🔑'
};

@Component({
  selector: 'app-roles-permisos-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles-permisos-admin.html',
  styleUrl: './roles-permisos-admin.css'
})
export class RolesPermisosAdmin implements OnInit {

  roles = signal<Rol[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  constructor(private rolService: RolService) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  private cargarRoles(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.rolService.listarTodos().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los roles.');
        this.cargando.set(false);
      }
    });
  }

  obtenerPermisos(nombreRol: string): PermisoDescripcion[] {
    return PERMISOS_POR_ROL[nombreRol] ?? [];
  }

  etiquetaRol(nombreRol: string): string {
    return ETIQUETA_ROL[nombreRol] ?? nombreRol;
  }

  iconoRol(nombreRol: string): string {
    return ICONO_ROL[nombreRol] ?? '👤';
  }
}