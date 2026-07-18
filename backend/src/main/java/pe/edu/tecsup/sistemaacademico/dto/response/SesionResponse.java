package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class SesionResponse {
    private UUID idSesion;
    private LocalDate fechaSesion;
    private String tema;
    private Integer semana;
    private UUID idHorario;
    private String nombreCurso;
}