package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class PorcentajeAsistenciaResponse {
    private UUID idMatricula;
    private long totalSesiones;
    private long presentes;
    private long tardanzas;
    private long ausencias;
    private double porcentajeAsistencia;
    private boolean enRiesgo; // true si porcentaje < 70%
}