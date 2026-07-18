package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class PeriodoAcademicoResponse {
    private UUID idPeriodo;
    private String codigo;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String estado;
}