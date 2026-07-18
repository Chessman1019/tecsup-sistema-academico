import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoAdminService } from '../../asistente/pagos/services/pago-admin.service';
import { PagoAdmin } from '../../asistente/pagos/models/pago-admin.model';

type FiltroEstado = 'todos' | 'pendiente' | 'pagado' | 'vencido';

@Component({
  selector: 'app-pagos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagos-admin.html',
  styleUrl: './pagos-admin.css'
})
export class PagosAdmin implements OnInit {

  pagos = signal<PagoAdmin[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);
  textoBusqueda = signal<string>('');
  filtroEstado = signal<FiltroEstado>('todos');

  totalRecaudado = computed(() =>
    this.pagos().filter(p => p.estado === 'Pagado').reduce((s, p) => s + p.monto, 0)
  );

  totalPendiente = computed(() =>
    this.pagos().filter(p => p.estado === 'Pendiente' || p.estado === 'Vencido').reduce((s, p) => s + p.monto, 0)
  );

  pagosFiltrados = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    const filtro = this.filtroEstado();

    return this.pagos().filter(p => {
      const coincideTexto = !texto ||
        p.nombreEstudiante.toLowerCase().includes(texto) ||
        p.codigoAlumno.toLowerCase().includes(texto) ||
        p.concepto.toLowerCase().includes(texto);

      const coincideEstado =
        filtro === 'todos' ||
        (filtro === 'pendiente' && p.estado === 'Pendiente') ||
        (filtro === 'pagado' && p.estado === 'Pagado') ||
        (filtro === 'vencido' && p.estado === 'Vencido');

      return coincideTexto && coincideEstado;
    });
  });

  constructor(private pagoAdminService: PagoAdminService) {}

  ngOnInit(): void {
    this.cargarPagos();
  }

  private cargarPagos(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.pagoAdminService.listarTodos().subscribe({
      next: (pagos) => {
        this.pagos.set(pagos);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los pagos.');
        this.cargando.set(false);
      }
    });
  }

  onBusquedaChange(valor: string): void {
    this.textoBusqueda.set(valor);
  }

  cambiarFiltro(filtro: FiltroEstado): void {
    this.filtroEstado.set(filtro);
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'Pagado': return 'estado-pagado';
      case 'Vencido': return 'estado-vencido';
      default: return 'estado-pendiente';
    }
  }
}