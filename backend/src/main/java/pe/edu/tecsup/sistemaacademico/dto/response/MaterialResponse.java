package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class MaterialResponse {
    private UUID idMaterial;
    private String titulo;
    private String descripcion;
    private String urlArchivo;
    private String tipo;
    private LocalDateTime fechaSubida;
    private UUID idCurso;
    private String nombreCurso;
    private String nombreDocente;
}