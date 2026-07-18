package pe.edu.tecsup.sistemaacademico.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class EvaluacionRequest {

    @NotNull(message = "El curso es obligatorio")
    private UUID idCurso;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El tipo es obligatorio")
    private String tipo;

    @NotNull(message = "El peso es obligatorio")
    @DecimalMin(value = "0.0", message = "El peso no puede ser negativo")
    @DecimalMax(value = "100.0", message = "El peso no puede ser mayor a 100")
    private BigDecimal peso;

    private LocalDate fechaProgramada;
}