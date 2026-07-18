import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentoService } from './services/documento.service';
import { Documento } from './models/documento.model';

@Component({
  selector: 'app-documentos-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documentos-page.html',
  styleUrl: './documentos-page.css'
})
export class DocumentosPage implements OnInit {

  documentos = signal<Documento[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);

  constructor(private documentoService: DocumentoService) {}

  ngOnInit(): void {
    this.cargarDocumentos();
  }

  private cargarDocumentos(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.documentoService.obtenerMisDocumentos().subscribe({
      next: (documentos) => {
        this.documentos.set(documentos);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar tus documentos.');
        this.cargando.set(false);
      }
    });
  }

  obtenerIconoPorTipo(tipo: string): string {
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('pdf')) return '📕';
    if (tipoLower.includes('imagen') || tipoLower.includes('foto')) return '🖼️';
    if (tipoLower.includes('word') || tipoLower.includes('doc')) return '📄';
    return '📁';
  }
}