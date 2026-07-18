package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class IncidenciaResponse {
    private UUID idIncidencia;
    private String titulo;
    private String descripcion;
    private String tipo;
    private String prioridad;
    private String estado;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaResolucion;
    private String nombreDocente;
    private String nombreCurso;
}