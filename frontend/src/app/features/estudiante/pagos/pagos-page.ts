import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagoService } from './services/pago.service';
import { Pago } from './models/pago.model';

@Component({
  selector: 'app-pagos-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagos-page.html',
  styleUrl: './pagos-page.css'
})
export class PagosPage implements OnInit {

  pagos = signal<Pago[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  totalPendiente = computed(() =>
    this.pagos()
      .filter(p => p.estado === 'Pendiente' || p.estado === 'Vencido')
      .reduce((suma, p) => suma + p.monto, 0)
  );

  cantidadVencidos = computed(() =>
    this.pagos().filter(p => p.estado === 'Vencido').length
  );

  constructor(private pagoService: PagoService) {}

  ngOnInit(): void {
    this.cargarPagos();
  }

  private cargarPagos(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.pagoService.obtenerMisPagos().subscribe({
      next: (pagos) => {
        this.pagos.set(pagos);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar tus pagos.');
        this.cargando.set(false);
      }
    });
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'Pagado': return 'badge-exito';
      case 'Vencido': return 'badge-peligro';
      default: return 'badge-advertencia';
    }
  }
}