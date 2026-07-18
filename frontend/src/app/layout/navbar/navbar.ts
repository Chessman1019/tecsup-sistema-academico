import { Component, EventEmitter, HostListener, OnInit, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { PerfilService } from '../../core/services/perfil.service';
import { Notificacion } from '../../core/models/notificacion.model';
import { MENU_POR_ROL, OpcionMenu } from '../../core/constants/menu-roles';

type MenuAbierto = 'notificaciones' | 'ayuda' | 'apps' | null;
type SeccionAyuda = 'manual' | 'faq' | null;

const COLOR_POR_ROL: Record<string, string> = {
  ADMIN: '#0A1628',
  ESTUDIANTE: '#0092D6',
  DOCENTE: '#1B8A5A',
  ASISTENTE_REGISTRO: '#B7791F',
  COORDINADOR_ACADEMICO: '#6B46C1',
  JEFE_GESTION_ACADEMICA: '#0A1628'
};

const MANUAL_POR_ROL: Record<string, string[]> = {
  ESTUDIANTE: [
    'En Matrícula puedes inscribirte en los cursos disponibles del ciclo.',
    'En Calificaciones y Asistencia consultas tu avance académico.',
    'En Certificados solicitas constancias y en Pagos revisas tu estado de cuenta.'
  ],
  DOCENTE: [
    'En Mis Cursos ves los cursos que dictas este ciclo.',
    'En Asistencia registras la asistencia de tus alumnos por sesión.',
    'En Calificaciones ingresas notas por evaluación.'
  ],
  ASISTENTE_REGISTRO: [
    'En Estudiantes gestionas los datos de los alumnos.',
    'En Matrículas registras y consultas inscripciones.',
    'En Pagos y Documentos administras trámites de los estudiantes.'
  ],
  COORDINADOR_ACADEMICO: [
    'En Docentes y Cursos gestionas la oferta académica.',
    'En Horarios asignas docentes, aulas y franjas horarias.',
    'En Incidencias haces seguimiento a casos académicos.'
  ],
  JEFE_GESTION_ACADEMICA: [
    'En Indicadores y Estadísticas ves el panorama institucional.',
    'En Aprobaciones gestionas solicitudes pendientes.',
    'En Configuración administras los parámetros del sistema.'
  ],
  ADMIN: [
    'En Usuarios creas y gestionas las cuentas del sistema.',
    'En Auditoría revisas el registro de acciones de los usuarios.',
    'En Configuración administras los parámetros institucionales.'
  ]
};

const PREGUNTAS_FRECUENTES = [
  { pregunta: '¿Cómo cambio mi foto de perfil?', respuesta: 'Haz clic sobre tu avatar en la esquina superior derecha y selecciona una imagen (máx. 500 KB).' },
  { pregunta: '¿Por qué no puedo matricularme en un curso?', respuesta: 'Puede que no haya vacantes en el horario o que no cumplas los prerrequisitos. Consulta con Registro.' },
  { pregunta: '¿Cómo veo mis notificaciones?', respuesta: 'Usa la campana 🔔 de la barra superior. Al abrirla, se marcan como leídas.' },
  { pregunta: 'Olvidé mi contraseña, ¿qué hago?', respuesta: 'Contacta al administrador del sistema o a soporte para restablecerla.' }
];

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  @Output() menuToggle = new EventEmitter<void>();

  menuAbierto = signal<MenuAbierto>(null);
  tituloModulo = signal<string>('Inicio');

  // ---------- Buscador ----------
  busqueda = signal<string>('');

  resultadosBusqueda = computed<OpcionMenu[]>(() => {
    const termino = this.busqueda().trim().toLowerCase();
    if (termino.length < 2) return [];
    const usuario = this.authService.currentUser();
    if (!usuario) return [];
    const opciones = MENU_POR_ROL[usuario.rol] ?? [];
    return opciones.filter(o => o.etiqueta.toLowerCase().includes(termino));
  });

  // ---------- Notificaciones ----------
  notificaciones = signal<Notificacion[]>([]);
  cargandoNotificaciones = signal(false);

  notificacionesNoLeidas = computed(() =>
    this.notificaciones().filter(n => !n.leida).length
  );

  // ---------- Ayuda ----------
  seccionAyuda = signal<SeccionAyuda>(null);
  preguntasFrecuentes = PREGUNTAS_FRECUENTES;

  manualDelRol = computed<string[]>(() => {
    const usuario = this.authService.currentUser();
    return usuario ? (MANUAL_POR_ROL[usuario.rol] ?? []) : [];
  });

  // ---------- Perfil / foto ----------
  subiendoFoto = signal(false);
  errorFoto = signal<string | null>(null);

  colorRol = computed(() => {
    const usuario = this.authService.currentUser();
    return usuario ? (COLOR_POR_ROL[usuario.rol] ?? '#0092D6') : '#0092D6';
  });

  inicialUsuario = computed(() => {
    const usuario = this.authService.currentUser();
    return usuario ? usuario.username.charAt(0).toUpperCase() : '?';
  });

  constructor(
    public authService: AuthService,
    public perfilService: PerfilService,
    private notificacionService: NotificacionService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarNotificaciones();
    this.perfilService.cargarFoto();
    this.escucharCambiosDeRuta();
  }

  private escucharCambiosDeRuta(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      let ruta = this.activatedRoute;
      while (ruta.firstChild) {
        ruta = ruta.firstChild;
      }
      const titulo = ruta.snapshot.title;
      this.tituloModulo.set(titulo ?? 'Inicio');
    });

    let rutaInicial = this.activatedRoute;
    while (rutaInicial.firstChild) {
      rutaInicial = rutaInicial.firstChild;
    }
    this.tituloModulo.set(rutaInicial.snapshot.title ?? 'Inicio');
  }

  private cargarNotificaciones(): void {
    this.cargandoNotificaciones.set(true);
    this.notificacionService.obtenerMisNotificaciones().subscribe({
      next: (notificaciones) => {
        this.notificaciones.set(notificaciones);
        this.cargandoNotificaciones.set(false);
      },
      error: () => this.cargandoNotificaciones.set(false)
    });
  }

  onMenuClick(): void {
    this.menuToggle.emit();
  }

  toggleMenu(menu: MenuAbierto): void {
    const abriendo = this.menuAbierto() !== menu;
    this.menuAbierto.update(actual => actual === menu ? null : menu);

    if (menu === 'notificaciones' && abriendo) {
      this.abrirNotificaciones();
    }
    if (menu === 'ayuda' && !abriendo) {
      this.seccionAyuda.set(null);
    }
  }

  cerrarMenus(): void {
    this.menuAbierto.set(null);
    this.seccionAyuda.set(null);
  }

  // ---------- Buscador ----------

  navegarAResultado(opcion: OpcionMenu): void {
    this.busqueda.set('');
    this.router.navigate([opcion.ruta]);
  }

  onEnterBusqueda(): void {
    const resultados = this.resultadosBusqueda();
    if (resultados.length > 0) {
      this.navegarAResultado(resultados[0]);
    }
  }

  limpiarBusqueda(): void {
    this.busqueda.set('');
  }

  // ---------- Notificaciones ----------

  private abrirNotificaciones(): void {
    this.cargandoNotificaciones.set(true);
    this.notificacionService.obtenerMisNotificaciones().subscribe({
      next: (notificaciones) => {
        this.notificaciones.set(notificaciones);
        this.cargandoNotificaciones.set(false);
        this.marcarTodasComoLeidas(notificaciones);
      },
      error: () => this.cargandoNotificaciones.set(false)
    });
  }

  private marcarTodasComoLeidas(notificaciones: Notificacion[]): void {
    const noLeidas = notificaciones.filter(n => !n.leida);
    if (noLeidas.length === 0) return;

    const peticiones = noLeidas.map(n =>
      this.notificacionService.marcarComoLeida(n.idNotificacion)
    );

    forkJoin(peticiones).subscribe({
      next: () => {
        this.notificaciones.update(lista =>
          lista.map(n => ({ ...n, leida: true }))
        );
      }
    });
  }

  // ---------- Ayuda ----------

  toggleSeccionAyuda(seccion: SeccionAyuda): void {
    this.seccionAyuda.update(actual => actual === seccion ? null : seccion);
  }

  contactarSoporte(): void {
    window.location.href = 'mailto:soporte@tecsup.edu.pe?subject=Soporte%20Sistema%20Acad%C3%A9mico';
  }

  // ---------- Foto de perfil ----------

  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = '';

    if (!archivo) return;

    this.errorFoto.set(null);

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
        next: () => this.subiendoFoto.set(false),
        error: (err) => {
          this.subiendoFoto.set(false);
          this.errorFoto.set(err.error?.message || 'No se pudo subir la imagen.');
        }
      });
    };
    lector.readAsDataURL(archivo);
  }

  @HostListener('document:click', ['$event'])
  onClickFuera(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar-dropdown-wrapper') && !target.closest('.navbar-search')) {
      this.cerrarMenus();
      this.limpiarBusqueda();
    }
  }
}