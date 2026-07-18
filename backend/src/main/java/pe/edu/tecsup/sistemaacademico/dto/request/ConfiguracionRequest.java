package pe.edu.tecsup.sistemaacademico.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfiguracionRequest {

    @NotBlank(message = "El valor es obligatorio")
    @Size(max = 255, message = "El valor no puede superar los 255 caracteres")
    private String valor;
}