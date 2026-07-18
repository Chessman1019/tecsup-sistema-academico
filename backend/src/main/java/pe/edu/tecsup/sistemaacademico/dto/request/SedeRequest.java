package pe.edu.tecsup.sistemaacademico.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SedeRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String direccion;

    @NotBlank(message = "La ciudad es obligatoria")
    private String ciudad;

    private Boolean estado;
}