import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('./features/welcome/welcome').then(m => m.Welcome)
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'app',
    component: MainLayout,
    canActivate: [authGuard],
    children: [

      {
        path: 'dashboard',
        title: 'Inicio',
        loadComponent: () =>
          import('./features/dashboard-redirect/dashboard-redirect').then(m => m.DashboardRedirect)
      },

      // ===================== ESTUDIANTE =====================
      {
        path: 'estudiante/dashboard',
        title: 'Inicio',
        loadComponent: () =>
          import('./features/estudiante/dashboard/dashboard').then(m => m.DashboardEstudiante)
      },
      {
        path: 'estudiante/matricula',
        title: 'Matrícula',
        loadComponent: () =>
          import('./features/estudiante/matricula/matricula-page').then(m => m.MatriculaPage)
      },
      {
        path: 'estudiante/cursos',
        title: 'Cursos',
        loadComponent: () =>
          import('./features/estudiante/cursos/cursos-page').then(m => m.CursosPage)
      },
      {
        path: 'estudiante/calificaciones',
        title: 'Mis Calificaciones',
        loadComponent: () =>
          import('./features/estudiante/calificaciones/calificaciones-page').then(m => m.CalificacionesPage)
      },
      {
        path: 'estudiante/asistencia',
        title: 'Mi Asistencia',
        loadComponent: () =>
          import('./features/estudiante/asistencia/asistencia-page').then(m => m.AsistenciaPage)
      },
      {
        path: 'estudiante/horario',
        title: 'Mi Horario',
        loadComponent: () =>
          import('./features/estudiante/horario/horario-page').then(m => m.HorarioPage)
      },
      {
        path: 'estudiante/certificados',
        title: 'Certificados',
        loadComponent: () =>
          import('./features/estudiante/certificados/certificados-page').then(m => m.CertificadosPage)
      },
      {
        path: 'estudiante/pagos',
        title: 'Mis Pagos',
        loadComponent: () =>
          import('./features/estudiante/pagos/pagos-page').then(m => m.PagosPage)
      },
      {
        path: 'estudiante/documentos',
        title: 'Mis Documentos',
        loadComponent: () =>
          import('./features/estudiante/documentos/documentos-page').then(m => m.DocumentosPage)
      },
      {
        path: 'estudiante/notificaciones',
        title: 'Notificaciones',
        loadComponent: () =>
          import('./features/estudiante/notificaciones/notificaciones-page').then(m => m.NotificacionesPage)
      },
      {
        path: 'estudiante/perfil',
        title: 'Mi Perfil',
        loadComponent: () =>
          import('./features/estudiante/perfil/perfil-page').then(m => m.PerfilPage)
      },

      // ===================== DOCENTE =====================
      {
        path: 'docente/dashboard',
        title: 'Inicio',
        loadComponent: () =>
          import('./features/docente/dashboard/dashboard').then(m => m.DashboardDocente)
      },
      {
        path: 'docente/cursos',
        title: 'Mis Cursos',
        loadComponent: () =>
          import('./features/docente/cursos/cursos-docente').then(m => m.CursosDocente)
      },
      {
        path: 'docente/estudiantes',
        title: 'Mis Estudiantes',
        loadComponent: () =>
          import('./features/docente/estudiantes/estudiantes-docente').then(m => m.EstudiantesDocente)
      },
      {
        path: 'docente/asistencia',
        title: 'Asistencia',
        loadComponent: () =>
          import('./features/docente/asistencia/asistencia-docente').then(m => m.AsistenciaDocente)
      },
      {
        path: 'docente/calificaciones',
        title: 'Calificaciones',
        loadComponent: () =>
          import('./features/docente/calificaciones/calificaciones-docente').then(m => m.CalificacionesDocente)
      },
      {
        path: 'docente/evaluaciones',
        title: 'Evaluaciones',
        loadComponent: () =>
          import('./features/docente/evaluaciones/evaluaciones-docente').then(m => m.EvaluacionesDocente)
      },
      {
        path: 'docente/materiales',
        title: 'Materiales',
        loadComponent: () =>
          import('./features/docente/materiales/materiales-docente').then(m => m.MaterialesDocente)
      },
      {
        path: 'docente/horarios',
        title: 'Mi Horario',
        loadComponent: () =>
          import('./features/docente/horarios/horarios-docente').then(m => m.HorariosDocente)
      },
      {
        path: 'docente/reportes',
        title: 'Reportes',
        loadComponent: () =>
          import('./features/docente/reportes/reportes-docente').then(m => m.ReportesDocente)
      },
      {
        path: 'docente/perfil',
        title: 'Mi Perfil',
        loadComponent: () =>
          import('./features/docente/perfil/perfil-docente').then(m => m.PerfilDocente)
      },

      // ===================== ASISTENTE =====================
      {
        path: 'asistente/dashboard',
        title: 'Inicio',
        loadComponent: () =>
          import('./features/asistente/dashboard/dashboard').then(m => m.DashboardAsistente)
      },
      {
        path: 'asistente/estudiantes',
        title: 'Estudiantes',
        loadComponent: () =>
          import('./features/asistente/estudiantes/estudiantes-asistente').then(m => m.EstudiantesAsistente)
      },
      {
        path: 'asistente/matriculas',
        title: 'Matrículas',
        loadComponent: () =>
          import('./features/asistente/matriculas/matriculas-asistente').then(m => m.MatriculasAsistente)
      },
      {
        path: 'asistente/pagos',
        title: 'Pagos',
        loadComponent: () =>
          import('./features/asistente/pagos/pagos-asistente').then(m => m.PagosAsistente)
      },
      {
        path: 'asistente/documentos',
        title: 'Documentos',
        loadComponent: () =>
          import('./features/asistente/documentos/documentos-asistente').then(m => m.DocumentosAsistente)
      },
      {
        path: 'asistente/reportes',
        title: 'Reportes',
        loadComponent: () =>
          import('./features/asistente/reportes/reportes-asistente').then(m => m.ReportesAsistente)
      },

      // ===================== COORDINADOR =====================
      {
        path: 'coordinador/dashboard',
        title: 'Inicio',
        loadComponent: () =>
          import('./features/coordinador/dashboard/dashboard').then(m => m.DashboardCoordinador)
      },
      {
        path: 'coordinador/docentes',
        title: 'Docentes',
        loadComponent: () =>
          import('./features/coordinador/docentes/docentes-coordinador').then(m => m.DocentesCoordinador)
      },
      {
        path: 'coordinador/estudiantes',
        title: 'Estudiantes',
        loadComponent: () =>
          import('./features/coordinador/estudiantes/estudiantes-coordinador').then(m => m.EstudiantesCoordinador)
      },
      {
        path: 'coordinador/cursos',
        title: 'Cursos',
        loadComponent: () =>
          import('./features/coordinador/cursos/cursos-coordinador').then(m => m.CursosCoordinador)
      },
      {
        path: 'coordinador/horarios',
        title: 'Horarios',
        loadComponent: () =>
          import('./features/coordinador/horarios/horarios-coordinador').then(m => m.HorariosCoordinador)
      },
      {
        path: 'coordinador/matriculas',
        title: 'Matrículas',
        loadComponent: () =>
          import('./features/coordinador/matricula/matriculas-coordinador').then(m => m.MatriculasCoordinador)
      },
      {
        path: 'coordinador/asistencia',
        title: 'Asistencia',
        loadComponent: () =>
          import('./features/coordinador/asistencia/asistencia-coordinador').then(m => m.AsistenciaCoordinador)
      },
      {
        path: 'coordinador/calificaciones',
        title: 'Calificaciones',
        loadComponent: () =>
          import('./features/coordinador/calificaciones/calificaciones-coordinador').then(m => m.CalificacionesCoordinador)
      },
      {
        path: 'coordinador/reportes',
        title: 'Reportes',
        loadComponent: () =>
          import('./features/coordinador/reportes/reportes-coordinador').then(m => m.ReportesCoordinador)
      },
      {
        path: 'coordinador/incidencias',
        title: 'Incidencias',
        loadComponent: () =>
          import('./features/coordinador/incidencias/incidencias-coordinador').then(m => m.IncidenciasCoordinador)
      },

      // ===================== JEFATURA =====================
      {
        path: 'jefatura/dashboard',
        title: 'Inicio',
        loadComponent: () =>
          import('./features/jefatura/dashboard/dashboard').then(m => m.DashboardJefatura)
      },
      {
        path: 'jefatura/docentes',
        title: 'Docentes',
        loadComponent: () =>
          import('./features/jefatura/docentes/docentes-jefatura').then(m => m.DocentesJefatura)
      },
      {
        path: 'jefatura/estudiantes',
        title: 'Estudiantes',
        loadComponent: () =>
          import('./features/jefatura/estudiantes/estudiantes-jefatura').then(m => m.EstudiantesJefatura)
      },
      {
        path: 'jefatura/reportes',
        title: 'Reportes',
        loadComponent: () =>
          import('./features/jefatura/reportes/reportes-jefatura').then(m => m.ReportesJefatura)
      },
      {
        path: 'jefatura/aprobaciones',
        title: 'Aprobaciones',
        loadComponent: () =>
          import('./features/jefatura/aprobaciones/aprobaciones-jefatura').then(m => m.AprobacionesJefatura)
      },
      {
        path: 'jefatura/indicadores',
        title: 'Indicadores',
        loadComponent: () =>
          import('./features/jefatura/indicadores/indicadores-jefatura').then(m => m.IndicadoresJefatura)
      },
      {
        path: 'jefatura/estadisticas',
        title: 'Estadísticas',
        loadComponent: () =>
          import('./features/jefatura/estadisticas/estadisticas-jefatura').then(m => m.EstadisticasJefatura)
      },
      {
        path: 'jefatura/configuracion',
        title: 'Configuración',
        loadComponent: () =>
          import('./features/jefatura/configuracion/configuracion-jefatura').then(m => m.ConfiguracionJefatura)
      },

      // ===================== ADMIN =====================
      {
        path: 'admin/dashboard',
        title: 'Inicio',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard').then(m => m.DashboardAdmin)
      },
      {
        path: 'admin/usuarios',
        title: 'Usuarios',
        loadComponent: () =>
          import('./features/admin/usuarios/usuarios-admin').then(m => m.UsuariosAdmin)
      },
      {
        path: 'admin/cursos',
        title: 'Cursos',
        loadComponent: () =>
          import('./features/admin/cursos/cursos-admin').then(m => m.CursosAdmin)
      },
      {
        path: 'admin/docentes',
        title: 'Docentes',
        loadComponent: () =>
          import('./features/admin/docentes/docentes-admin').then(m => m.DocentesAdmin)
      },
      {
        path: 'admin/estudiantes',
        title: 'Estudiantes',
        loadComponent: () =>
          import('./features/admin/estudiantes/estudiantes-admin').then(m => m.EstudiantesAdmin)
      },
      {
        path: 'admin/matriculas',
        title: 'Matrículas',
        loadComponent: () =>
          import('./features/admin/matriculas/matriculas-admin').then(m => m.MatriculasAdmin)
      },
      {
        path: 'admin/horarios',
        title: 'Horarios',
        loadComponent: () =>
          import('./features/admin/horarios/horarios-admin').then(m => m.HorariosAdmin)
      },
      {
        path: 'admin/pagos',
        title: 'Pagos',
        loadComponent: () =>
          import('./features/admin/pagos/pagos-admin').then(m => m.PagosAdmin)
      },
      {
        path: 'admin/certificados',
        title: 'Certificados',
        loadComponent: () =>
          import('./features/admin/certificados/certificados-admin').then(m => m.CertificadosAdmin)
      },
      {
        path: 'admin/reportes',
        title: 'Reportes',
        loadComponent: () =>
          import('./features/admin/reportes/reportes-admin').then(m => m.ReportesAdmin)
      },
      {
        path: 'admin/roles-permisos',
        title: 'Roles y Permisos',
        loadComponent: () =>
          import('./features/admin/roles-permisos/roles-permisos-admin').then(m => m.RolesPermisosAdmin)
      },
      {
        path: 'admin/sedes',
        title: 'Sedes',
        loadComponent: () =>
          import('./features/admin/sedes/sedes-admin').then(m => m.SedesAdmin)
      },
      {
        path: 'admin/carreras',
        title: 'Carreras',
        loadComponent: () =>
          import('./features/admin/carreras/carreras-admin').then(m => m.CarrerasAdmin)
      },
      {
        path: 'admin/periodos-academicos',
        title: 'Períodos Académicos',
        loadComponent: () =>
          import('./features/admin/periodos-academicos/periodos-admin').then(m => m.PeriodosAdmin)
      },
      {
        path: 'admin/programas',
        title: 'Programas',
        loadComponent: () =>
          import('./features/admin/programas/programas-admin').then(m => m.ProgramasAdmin)
      },
      {
        path: 'admin/aulas',
        title: 'Aulas',
        loadComponent: () =>
          import('./features/admin/aulas/aulas-admin').then(m => m.AulasAdmin)
      },
      {
        path: 'admin/auditoria',
        title: 'Auditoría',
        loadComponent: () =>
          import('./features/admin/auditoria/auditoria-admin').then(m => m.AuditoriaAdmin)
      },
      {
        path: 'admin/configuracion',
        title: 'Configuración',
        loadComponent: () =>
          import('./features/admin/configuracion/configuracion-admin').then(m => m.ConfiguracionAdmin)
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'welcome'
  }
];