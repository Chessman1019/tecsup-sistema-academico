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
public class PagoResponse {
    private UUID idPago;
    private String concepto;
    private BigDecimal monto;
    private LocalDate fechaEmision;
    private LocalDate fechaVencimiento;
    private LocalDate fechaPago;
    private String estado;
    private String metodoPago;
    private String codigoAlumno;
    private String nombreEstudiante;
}