package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class ProgramaResponse {
    private UUID idPrograma;
    private String nombre;
    private String tipo;
    private Boolean estado;
    private String nombreCarrera;
}