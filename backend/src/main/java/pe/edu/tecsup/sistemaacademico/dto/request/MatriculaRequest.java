package pe.edu.tecsup.sistemaacademico.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class MatriculaRequest {

    @NotNull(message = "El estudiante es obligatorio")
    private UUID idEstudiante;

    @NotNull(message = "El curso es obligatorio")
    private UUID idCurso;

    @NotNull(message = "El horario es obligatorio")
    private UUID idHorario;

    @NotBlank(message = "El ciclo academico es obligatorio")
    private String cicloAcademico;
}