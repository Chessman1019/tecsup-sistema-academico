package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class AulaResponse {
    private UUID idAula;
    private String codigo;
    private String edificio;
    private Integer capacidad;
    private String tipo;
}