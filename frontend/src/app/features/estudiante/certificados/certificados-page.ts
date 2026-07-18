import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CertificadoService } from './services/certificado.service';
import { MatriculaService } from '../matricula/services/matricula.service';
import { Certificado } from './models/certificado.model';

interface TipoCertificado {
  valor: string;
  etiqueta: string;
}

@Component({
  selector: 'app-certificados-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './certificados-page.html',
  styleUrl: './certificados-page.css'
})
export class CertificadosPage implements OnInit {

  tiposDisponibles: TipoCertificado[] = [
    { valor: 'Constancia de matricula', etiqueta: 'Constancia de matrícula' },
    { valor: 'Constancia de notas', etiqueta: 'Constancia de notas' },
    { valor: 'Certificado de estudios', etiqueta: 'Certificado de estudios' },
    { valor: 'Constancia de egresado', etiqueta: 'Constancia de egresado' }
  ];

  tipoSeleccionado = signal<string>('');
  idEstudiante = signal<string>('');

  certificados = signal<Certificado[]>([]);
  cargando = signal(false);
  solicitando = signal(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  constructor(
    private certificadoService: CertificadoService,
    private matriculaService: MatriculaService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando.set(true);
    this.matriculaService.obtenerMiPerfil().subscribe({
      next: (estudiante) => {
        this.idEstudiante.set(estudiante.idEstudiante);
        this.cargarCertificados(estudiante.idEstudiante);
      },
      error: () => {
        this.mensajeError.set('No se pudo cargar tu perfil de estudiante.');
        this.cargando.set(false);
      }
    });
  }

  private cargarCertificados(idEstudiante: string): void {
    this.certificadoService.listarPorEstudiante(idEstudiante).subscribe({
      next: (certificados) => {
        this.certificados.set(certificados);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar tus certificados.');
        this.cargando.set(false);
      }
    });
  }

  onSolicitar(): void {
    const tipo = this.tipoSeleccionado();
    const idEstudiante = this.idEstudiante();

    if (!tipo || !idEstudiante) {
      this.mensajeError.set('Selecciona un tipo de certificado antes de solicitar.');
      return;
    }

    this.solicitando.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    this.certificadoService.solicitar({ idEstudiante, tipo }).subscribe({
      next: () => {
        this.mensajeExito.set('Solicitud enviada correctamente. Podrás ver su estado en la lista.');
        this.tipoSeleccionado.set('');
        this.cargarCertificados(idEstudiante);
        this.solicitando.set(false);
      },
      error: (err) => {
        this.mensajeError.set(err.error?.message || 'No se pudo enviar la solicitud.');
        this.solicitando.set(false);
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