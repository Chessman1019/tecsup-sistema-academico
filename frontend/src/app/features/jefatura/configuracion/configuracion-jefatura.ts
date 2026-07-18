import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracionService } from './services/configuracion.service';
import { Configuracion } from './models/configuracion.model';

interface GrupoConfiguracion {
  categoria: string;
  parametros: Configuracion[];
}

@Component({
  selector: 'app-configuracion-jefatura',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion-jefatura.html',
  styleUrl: './configuracion-jefatura.css'
})
export class ConfiguracionJefatura implements OnInit {

  configuraciones = signal<Configuracion[]>([]);
  cargando = signal(false);
  guardando = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  editandoId = signal<string | null>(null);
  valorEditado = signal<string>('');

  grupos = computed<GrupoConfiguracion[]>(() => {
    const mapa = new Map<string, Configuracion[]>();
    for (const config of this.configuraciones()) {
      const lista = mapa.get(config.categoria) ?? [];
      lista.push(config);
      mapa.set(config.categoria, lista);
    }
    return Array.from(mapa.entries())
      .map(([categoria, parametros]) => ({ categoria, parametros }))
      .sort((a, b) => a.categoria.localeCompare(b.categoria));
  });

  constructor(private configuracionService: ConfiguracionService) {}

  ngOnInit(): void {
    this.cargarConfiguraciones();
  }

  private cargarConfiguraciones(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.configuracionService.listarTodas().subscribe({
      next: (configuraciones) => {
        this.configuraciones.set(configuraciones);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los parámetros de configuración.');
        this.cargando.set(false);
      }
    });
  }

  iniciarEdicion(config: Configuracion): void {
    this.editandoId.set(config.idConfiguracion);
    this.valorEditado.set(config.valor);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
    this.valorEditado.set('');
  }

  guardar(config: Configuracion): void {
    const valor = this.valorEditado().trim();

    if (!valor) {
      this.mensajeError.set('El valor no puede estar vacío.');
      return;
    }

    if (valor === config.valor) {
      this.cancelarEdicion();
      return;
    }

    this.guardando.set(true);
    this.mensajeError.set(null);

    this.configuracionService.actualizarValor(config.idConfiguracion, { valor }).subscribe({
      next: (actualizada) => {
        this.configuraciones.update(lista =>
          lista.map(c => c.idConfiguracion === actualizada.idConfiguracion ? actualizada : c)
        );
        this.mensajeExito.set(`Parámetro "${actualizada.clave}" actualizado correctamente.`);
        this.guardando.set(false);
        this.cancelarEdicion();
      },
      error: (err) => {
        this.mensajeError.set(err.error?.message || 'No se pudo actualizar el parámetro.');
        this.guardando.set(false);
      }
    });
  }
}