package pe.edu.tecsup.sistemaacademico.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class CalificacionRequest {

    @NotNull(message = "La matricula es obligatoria")
    private UUID idMatricula;

    @NotNull(message = "La evaluacion es obligatoria")
    private UUID idEvaluacion;

    @NotNull(message = "La nota es obligatoria")
    @DecimalMin(value = "0.0", message = "La nota no puede ser negativa")
    @DecimalMax(value = "20.0", message = "La nota no puede ser mayor a 20")
    private BigDecimal nota;
}