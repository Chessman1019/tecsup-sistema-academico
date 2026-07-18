import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { Notificacion } from '../../../core/models/notificacion.model';

type Filtro = 'todas' | 'no-leidas' | 'leidas';

@Component({
  selector: 'app-notificaciones-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones-page.html',
  styleUrl: './notificaciones-page.css'
})
export class NotificacionesPage implements OnInit {

  notificaciones = signal<Notificacion[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);
  filtroActivo = signal<Filtro>('todas');

  notificacionesFiltradas = computed(() => {
    const filtro = this.filtroActivo();
    const lista = this.notificaciones();

    if (filtro === 'no-leidas') return lista.filter(n => !n.leida);
    if (filtro === 'leidas') return lista.filter(n => n.leida);
    return lista;
  });

  totalNoLeidas = computed(() => this.notificaciones().filter(n => !n.leida).length);

  constructor(private notificacionService: NotificacionService) {}

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  private cargarNotificaciones(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.notificacionService.obtenerMisNotificaciones().subscribe({
      next: (notificaciones) => {
        this.notificaciones.set(notificaciones);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar tus notificaciones.');
        this.cargando.set(false);
      }
    });
  }

  cambiarFiltro(filtro: Filtro): void {
    this.filtroActivo.set(filtro);
  }

  marcarComoLeida(notificacion: Notificacion): void {
    if (notificacion.leida) return;

    this.notificacionService.marcarComoLeida(notificacion.idNotificacion).subscribe({
      next: () => {
        this.notificaciones.update(lista =>
          lista.map(n => n.idNotificacion === notificacion.idNotificacion ? { ...n, leida: true } : n)
        );
      }
    });
  }
}