import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditoriaService } from './services/auditoria.service';
import { Auditoria } from './models/auditoria.model';

@Component({
  selector: 'app-auditoria-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auditoria-admin.html',
  styleUrl: './auditoria-admin.css'
})
export class AuditoriaAdmin implements OnInit {

  registros = signal<Auditoria[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);
  textoBusqueda = signal<string>('');

  registrosFiltrados = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    if (!texto) return this.registros();

    return this.registros().filter(r =>
      r.username.toLowerCase().includes(texto) ||
      r.accion.toLowerCase().includes(texto) ||
      r.entidad.toLowerCase().includes(texto)
    );
  });

  constructor(private auditoriaService: AuditoriaService) {}

  ngOnInit(): void {
    this.cargarRegistros();
  }

  private cargarRegistros(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.auditoriaService.listarTodas().subscribe({
      next: (registros) => {
        this.registros.set(registros);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los registros de auditoría.');
        this.cargando.set(false);
      }
    });
  }

  onBusquedaChange(valor: string): void {
    this.textoBusqueda.set(valor);
  }

  obtenerIconoAccion(accion: string): string {
    if (accion.includes('LOGIN')) return '🔐';
    if (accion.includes('CREAR')) return '➕';
    if (accion.includes('EDITAR') || accion.includes('ACTUALIZAR')) return '✏️';
    if (accion.includes('ELIMINAR')) return '🗑️';
    return '📋';
  }

  obtenerClaseAccion(accion: string): string {
    if (accion.includes('LOGIN')) return 'badge-info';
    if (accion.includes('CREAR')) return 'badge-exito';
    if (accion.includes('EDITAR') || accion.includes('ACTUALIZAR')) return 'badge-advertencia';
    if (accion.includes('ELIMINAR')) return 'badge-peligro';
    return 'badge-neutro';
  }
}