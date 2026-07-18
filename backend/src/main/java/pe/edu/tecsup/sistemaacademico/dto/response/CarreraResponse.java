package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class CarreraResponse {
    private UUID idCarrera;
    private String codigo;
    private String nombre;
    private Integer duracionCiclos;
    private Boolean estado;
    private String nombreSede;
}