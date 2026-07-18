export interface OpcionMenu {
  etiqueta: string;
  ruta: string;
  icono: string;
}

export const MENU_POR_ROL: Record<string, OpcionMenu[]> = {
  ESTUDIANTE: [
    { etiqueta: 'Inicio', ruta: '/app/estudiante/dashboard', icono: 'home' },
    { etiqueta: 'Matrícula', ruta: '/app/estudiante/matricula', icono: 'app_registration' },
    { etiqueta: 'Cursos', ruta: '/app/estudiante/cursos', icono: 'menu_book' },
    { etiqueta: 'Calificaciones', ruta: '/app/estudiante/calificaciones', icono: 'grade' },
    { etiqueta: 'Horario', ruta: '/app/estudiante/horario', icono: 'calendar_month' },
    { etiqueta: 'Asistencia', ruta: '/app/estudiante/asistencia', icono: 'event_available' },
    { etiqueta: 'Certificados', ruta: '/app/estudiante/certificados', icono: 'workspace_premium' },
    { etiqueta: 'Pagos', ruta: '/app/estudiante/pagos', icono: 'payments' },
    { etiqueta: 'Documentos', ruta: '/app/estudiante/documentos', icono: 'folder_open' },
    { etiqueta: 'Notificaciones', ruta: '/app/estudiante/notificaciones', icono: 'notifications' },
    { etiqueta: 'Mi Perfil', ruta: '/app/estudiante/perfil', icono: 'account_circle' }
  ],
  DOCENTE: [
    { etiqueta: 'Inicio', ruta: '/app/docente/dashboard', icono: 'home' },
    { etiqueta: 'Cursos', ruta: '/app/docente/cursos', icono: 'menu_book' },
    { etiqueta: 'Estudiantes', ruta: '/app/docente/estudiantes', icono: 'group' },
    { etiqueta: 'Asistencia', ruta: '/app/docente/asistencia', icono: 'event_available' },
    { etiqueta: 'Calificaciones', ruta: '/app/docente/calificaciones', icono: 'grade' },
    { etiqueta: 'Evaluaciones', ruta: '/app/docente/evaluaciones', icono: 'quiz' },
    { etiqueta: 'Materiales', ruta: '/app/docente/materiales', icono: 'folder_open' },
    { etiqueta: 'Horarios', ruta: '/app/docente/horarios', icono: 'calendar_month' },
    { etiqueta: 'Reportes', ruta: '/app/docente/reportes', icono: 'bar_chart' },
    { etiqueta: 'Mi Perfil', ruta: '/app/docente/perfil', icono: 'account_circle' }
  ],
  ASISTENTE_REGISTRO: [
    { etiqueta: 'Inicio', ruta: '/app/asistente/dashboard', icono: 'home' },
    { etiqueta: 'Estudiantes', ruta: '/app/asistente/estudiantes', icono: 'group' },
    { etiqueta: 'Matrículas', ruta: '/app/asistente/matriculas', icono: 'app_registration' },
    { etiqueta: 'Pagos', ruta: '/app/asistente/pagos', icono: 'payments' },
    { etiqueta: 'Documentos', ruta: '/app/asistente/documentos', icono: 'folder_open' },
    { etiqueta: 'Reportes', ruta: '/app/asistente/reportes', icono: 'bar_chart' }
  ],
  COORDINADOR_ACADEMICO: [
    { etiqueta: 'Inicio', ruta: '/app/coordinador/dashboard', icono: 'home' },
    { etiqueta: 'Docentes', ruta: '/app/coordinador/docentes', icono: 'co_present' },
    { etiqueta: 'Estudiantes', ruta: '/app/coordinador/estudiantes', icono: 'group' },
    { etiqueta: 'Cursos', ruta: '/app/coordinador/cursos', icono: 'menu_book' },
    { etiqueta: 'Horarios', ruta: '/app/coordinador/horarios', icono: 'calendar_month' },
    { etiqueta: 'Matrículas', ruta: '/app/coordinador/matriculas', icono: 'app_registration' },
    { etiqueta: 'Asistencia', ruta: '/app/coordinador/asistencia', icono: 'event_available' },
    { etiqueta: 'Calificaciones', ruta: '/app/coordinador/calificaciones', icono: 'grade' },
    { etiqueta: 'Reportes', ruta: '/app/coordinador/reportes', icono: 'bar_chart' },
    { etiqueta: 'Incidencias', ruta: '/app/coordinador/incidencias', icono: 'report_problem' }
  ],
  JEFE_GESTION_ACADEMICA: [
    { etiqueta: 'Inicio', ruta: '/app/jefatura/dashboard', icono: 'home' },
    { etiqueta: 'Docentes', ruta: '/app/jefatura/docentes', icono: 'co_present' },
    { etiqueta: 'Estudiantes', ruta: '/app/jefatura/estudiantes', icono: 'group' },
    { etiqueta: 'Reportes', ruta: '/app/jefatura/reportes', icono: 'bar_chart' },
    { etiqueta: 'Aprobaciones', ruta: '/app/jefatura/aprobaciones', icono: 'task_alt' },
    { etiqueta: 'Indicadores', ruta: '/app/jefatura/indicadores', icono: 'monitoring' },
    { etiqueta: 'Estadísticas', ruta: '/app/jefatura/estadisticas', icono: 'insights' },
    { etiqueta: 'Configuración', ruta: '/app/jefatura/configuracion', icono: 'settings' }
  ],
  ADMIN: [
    { etiqueta: 'Inicio', ruta: '/app/admin/dashboard', icono: 'home' },
    { etiqueta: 'Usuarios', ruta: '/app/admin/usuarios', icono: 'manage_accounts' },
    { etiqueta: 'Roles y Permisos', ruta: '/app/admin/roles-permisos', icono: 'key' },
    { etiqueta: 'Sedes', ruta: '/app/admin/sedes', icono: 'apartment' },
    { etiqueta: 'Carreras', ruta: '/app/admin/carreras', icono: 'school' },
    { etiqueta: 'Programas', ruta: '/app/admin/programas', icono: 'auto_stories' },
    { etiqueta: 'Períodos', ruta: '/app/admin/periodos-academicos', icono: 'date_range' },
    { etiqueta: 'Cursos', ruta: '/app/admin/cursos', icono: 'menu_book' },
    { etiqueta: 'Docentes', ruta: '/app/admin/docentes', icono: 'co_present' },
    { etiqueta: 'Estudiantes', ruta: '/app/admin/estudiantes', icono: 'group' },
    { etiqueta: 'Matrículas', ruta: '/app/admin/matriculas', icono: 'app_registration' },
    { etiqueta: 'Aulas', ruta: '/app/admin/aulas', icono: 'meeting_room' },
    { etiqueta: 'Horarios', ruta: '/app/admin/horarios', icono: 'calendar_month' },
    { etiqueta: 'Pagos', ruta: '/app/admin/pagos', icono: 'payments' },
    { etiqueta: 'Certificados', ruta: '/app/admin/certificados', icono: 'workspace_premium' },
    { etiqueta: 'Reportes', ruta: '/app/admin/reportes', icono: 'bar_chart' },
    { etiqueta: 'Auditoría', ruta: '/app/admin/auditoria', icono: 'shield_person' },
    { etiqueta: 'Configuración', ruta: '/app/admin/configuracion', icono: 'settings' }
  ]
};