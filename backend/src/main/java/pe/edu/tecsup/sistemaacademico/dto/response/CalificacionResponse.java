package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class CalificacionResponse {
    private UUID idCalificacion;
    private String nombreEstudiante;
    private String nombreEvaluacion;
    private BigDecimal nota;
    private LocalDateTime fechaRegistro;
}