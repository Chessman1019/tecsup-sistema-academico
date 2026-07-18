import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentoAdminService } from './services/documento-admin.service';
import { DocumentoAdmin } from './models/documento-admin.model';

@Component({
  selector: 'app-documentos-asistente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documentos-asistente.html',
  styleUrl: './documentos-asistente.css'
})
export class DocumentosAsistente implements OnInit {

  documentos = signal<DocumentoAdmin[]>([]);
  cargando = signal(false);
  mensajeError = signal<string | null>(null);
  textoBusqueda = signal<string>('');

  documentosFiltrados = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    if (!texto) return this.documentos();

    return this.documentos().filter(d =>
      d.nombreEstudiante.toLowerCase().includes(texto) ||
      d.codigoAlumno.toLowerCase().includes(texto) ||
      d.nombre.toLowerCase().includes(texto)
    );
  });

  constructor(private documentoAdminService: DocumentoAdminService) {}

  ngOnInit(): void {
    this.cargarDocumentos();
  }

  private cargarDocumentos(): void {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.documentoAdminService.listarTodos().subscribe({
      next: (documentos) => {
        this.documentos.set(documentos);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar los documentos.');
        this.cargando.set(false);
      }
    });
  }

  onBusquedaChange(valor: string): void {
    this.textoBusqueda.set(valor);
  }

  obtenerIcono(tipo: string): string {
    const t = tipo.toLowerCase();
    if (t.includes('pdf')) return '📕';
    if (t.includes('imagen') || t.includes('foto')) return '🖼️';
    if (t.includes('word') || t.includes('doc')) return '📄';
    return '📁';
  }
}