package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class DocumentoResponse {
    private UUID idDocumento;
    private String nombre;
    private String tipo;
    private String urlArchivo;
    private LocalDateTime fechaSubida;
    private String codigoAlumno;
    private String nombreEstudiante;
}