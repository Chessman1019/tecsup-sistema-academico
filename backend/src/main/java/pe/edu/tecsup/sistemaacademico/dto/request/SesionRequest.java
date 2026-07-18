package pe.edu.tecsup.sistemaacademico.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class SesionRequest {

    @NotNull(message = "El horario es obligatorio")
    private UUID idHorario;

    private LocalDate fecha;

    private String tema;

    private Integer semana;
}