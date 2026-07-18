package pe.edu.tecsup.sistemaacademico.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class IncidenciaRequest {

    @NotBlank(message = "El titulo es obligatorio")
    private String titulo;

    @NotBlank(message = "La descripcion es obligatoria")
    private String descripcion;

    @NotBlank(message = "El tipo es obligatorio")
    private String tipo;

    private String prioridad;

    private UUID idDocente;

    private UUID idCurso;
}