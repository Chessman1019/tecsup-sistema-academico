package pe.edu.tecsup.sistemaacademico.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AulaRequest {

    @NotBlank(message = "El codigo es obligatorio")
    private String codigo;

    @NotBlank(message = "El edificio es obligatorio")
    private String edificio;

    @NotNull(message = "La capacidad es obligatoria")
    private Integer capacidad;

    private String tipo;
}