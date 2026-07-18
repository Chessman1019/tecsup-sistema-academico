package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalTime;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class HorarioResponse {
    private UUID idHorario;
    private UUID idCurso;
    private String nombreCurso;
    private String nombreDocente;
    private String codigoAula;
    private Short diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String ciclo;
}