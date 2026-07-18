package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class CursoResponse {
    private UUID idCurso;
    private String codigoCurso;
    private String nombre;
    private Integer creditos;
    private Integer horasSemanales;
    private Boolean estado;
}