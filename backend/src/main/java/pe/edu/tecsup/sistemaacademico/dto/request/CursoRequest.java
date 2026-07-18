package pe.edu.tecsup.sistemaacademico.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CursoRequest {

    @NotBlank(message = "El codigo del curso es obligatorio")
    private String codigoCurso;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotNull(message = "Los creditos son obligatorios")
    private Integer creditos;

    @NotNull(message = "Las horas semanales son obligatorias")
    private Integer horasSemanales;

    private Boolean estado;
}