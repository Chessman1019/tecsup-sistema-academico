package pe.edu.tecsup.sistemaacademico.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
public class HorarioRequest {

    @NotNull(message = "El curso es obligatorio")
    private UUID idCurso;

    @NotNull(message = "El docente es obligatorio")
    private UUID idDocente;

    @NotNull(message = "El aula es obligatoria")
    private UUID idAula;

    @NotNull(message = "El dia de la semana es obligatorio")
    @Min(value = 1, message = "El dia debe estar entre 1 (Lunes) y 7 (Domingo)")
    @Max(value = 7, message = "El dia debe estar entre 1 (Lunes) y 7 (Domingo)")
    private Short diaSemana;

    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime horaInicio;

    @NotNull(message = "La hora de fin es obligatoria")
    private LocalTime horaFin;

    @NotNull(message = "El ciclo es obligatorio")
    private String ciclo;
}