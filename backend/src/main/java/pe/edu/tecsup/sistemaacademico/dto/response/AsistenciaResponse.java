package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class AsistenciaResponse {
    private UUID idRegistro;
    private String nombreEstudiante;
    private LocalDate fecha;
    private String estado;
    private String observacion;
}