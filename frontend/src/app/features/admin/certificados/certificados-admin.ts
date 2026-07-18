import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CertificadoAdminService } from './services/certificado-admin.service';
import { CertificadoAdmin } from './models/certificado-admin.model';
import { ModalConfirmacion } from '../../../shared/components/modal-confirmacion/modal-confirmacion';

type FiltroEstado = 'todos' | 'Pendiente' | 'Emitido' | 'Rechazado';

@Component({
  selector: 'app-certificados-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalConfirmacion],
  templateUrl: './certificados-admin.html',
  styleUrl: './certificados-admin.css'
})
export class CertificadosAdmin implements OnInit {

  certificados = signal<CertificadoAdmin[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);
  filtroEstado = signal<FiltroEstado>('todos');
  textoBusqueda = signal<string>('');

  // Confirmación de emisión
  certificadoAEmitir = signal<CertificadoAdmin | null>(null);
  emitiendo = signal(false);

  certificadosFiltrados = computed(() => {
    const filtro = this.filtroEstado();
    const texto = this.textoBusqueda().trim().toLowerCase();

    return this.certificados().filter(c => {
      const coincideEstado = filtro === 'todos' || c.estado === filtro;
      const coincideTexto = !texto ||
        c.nombreEstudiante.toLowerCase().includes(texto) ||
        c.tipo.toLowerCase().includes(texto);
      return coincideEstado && coincideTexto;
    });
  });

  totalPendientes = computed(() =>
    this.certificados().filter(c => c.estado === 'Pendiente').length
  );

  constructor(private certificadoAdminService: CertificadoAdminService) {}

  ngOnInit(): void {
    this.cargarCertificados();
  }

  private cargarCertificados(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.certificadoAdminService.listarTodos().subscribe({
      next: (certificados) => {
        this.certificados.set(certificados);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los certificados.');
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

  // ---------- Emitir (con confirmación) ----------

  pedirEmision(cert: CertificadoAdmin): void {
    this.certificadoAEmitir.set(cert);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  confirmarEmision(): void {
    const cert = this.certificadoAEmitir();
    if (!cert) return;

    this.emitiendo.set(true);

    const urlSimulada = `https://tecsup.edu.pe/certificados/${cert.idCertificado}.pdf`;

    this.certificadoAdminService.emitir(cert.idCertificado, urlSimulada).subscribe({
      next: () => {
        this.mensajeExito.set(`Certificado de ${cert.nombreEstudiante} emitido correctamente.`);
        this.certificadoAEmitir.set(null);
        this.emitiendo.set(false);
        this.cargarCertificados();
      },
      error: () => {
        this.mensajeError.set('No se pudo emitir el certificado.');
        this.certificadoAEmitir.set(null);
        this.emitiendo.set(false);
      }
    });
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'Emitido': return 'badge-exito';
      case 'Rechazado': return 'badge-peligro';
      default: return 'badge-advertencia';
    }
  }
}