package pe.edu.tecsup.sistemaacademico.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioRequest {

    @NotBlank(message = "El username es obligatorio")
    private String username;

    private String password;

    @NotBlank(message = "El rol es obligatorio")
    private String nombreRol;

    private Boolean estado;
}