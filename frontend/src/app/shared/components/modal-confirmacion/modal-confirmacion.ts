import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TipoModal = 'peligro' | 'info' | 'exito';

@Component({
  selector: 'app-modal-confirmacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="modal-overlay" (click)="onCancelar()">
        <div class="modal-card" (click)="$event.stopPropagation()">

          <div class="modal-header">
            <div class="modal-icono" [ngClass]="claseIcono">
              {{ icono }}
            </div>
            <h2 class="modal-titulo">{{ titulo }}</h2>
          </div>

          <div class="modal-cuerpo">
            <p class="modal-texto" [innerHTML]="mensaje"></p>
          </div>

          <div class="modal-acciones">
            <button class="btn btn-borde" (click)="onCancelar()" [disabled]="procesando">
              {{ textoCancelar }}
            </button>
            <button
              class="btn"
              [ngClass]="claseBotonConfirmar"
              (click)="onConfirmar()"
              [disabled]="procesando">
              {{ procesando ? 'Procesando...' : textoConfirmar }}
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class ModalConfirmacion {

  @Input() visible = false;
  @Input() tipo: TipoModal = 'peligro';
  @Input() titulo = '¿Estás seguro?';
  @Input() mensaje = 'Esta acción no se puede deshacer.';
  @Input() textoConfirmar = 'Confirmar';
  @Input() textoCancelar = 'Cancelar';
  @Input() procesando = false;

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  get icono(): string {
    switch (this.tipo) {
      case 'peligro': return '⚠️';
      case 'exito': return '✅';
      default: return 'ℹ️';
    }
  }

  get claseIcono(): string {
    switch (this.tipo) {
      case 'peligro': return 'modal-icono-peligro';
      case 'exito': return 'modal-icono-exito';
      default: return 'modal-icono-info';
    }
  }

  get claseBotonConfirmar(): string {
    return this.tipo === 'peligro' ? 'btn-peligro' : 'btn-primario';
  }

  onConfirmar(): void {
    this.confirmar.emit();
  }

  onCancelar(): void {
    if (!this.procesando) {
      this.cancelar.emit();
    }
  }
}