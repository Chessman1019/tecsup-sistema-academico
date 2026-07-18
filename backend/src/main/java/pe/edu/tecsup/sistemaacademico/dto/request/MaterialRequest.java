package pe.edu.tecsup.sistemaacademico.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class MaterialRequest {

    @NotNull(message = "El curso es obligatorio")
    private UUID idCurso;

    @NotBlank(message = "El titulo es obligatorio")
    private String titulo;

    private String descripcion;

    private String urlArchivo;

    @NotBlank(message = "El tipo es obligatorio")
    private String tipo;
}