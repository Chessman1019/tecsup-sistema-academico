package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class EvaluacionResponse {
    private UUID idEvaluacion;
    private String nombre;
    private String tipo;
    private BigDecimal peso;
    private LocalDate fechaProgramada;
    private UUID idCurso;
    private String nombreCurso;
}