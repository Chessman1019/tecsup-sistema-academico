package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class SedeResponse {
    private UUID idSede;
    private String nombre;
    private String direccion;
    private String ciudad;
    private Boolean estado;
}