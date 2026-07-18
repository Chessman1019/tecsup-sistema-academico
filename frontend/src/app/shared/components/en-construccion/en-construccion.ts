import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-en-construccion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './en-construccion.html',
  styleUrl: './en-construccion.css'
})
export class EnConstruccion {
  @Input() titulo: string = 'Módulo';
  @Input() descripcion: string = 'Esta sección está en desarrollo y estará disponible próximamente.';
}