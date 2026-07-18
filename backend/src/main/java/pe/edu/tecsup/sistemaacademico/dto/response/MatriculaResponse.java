package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class MatriculaResponse {
    private UUID idMatricula;
    private String codigoAlumno;
    private String nombreCompletoEstudiante;
    private String codigoCurso;
    private String nombreCurso;
    private String cicloAcademico;
    private LocalDate fechaMatricula;
    private String estado;

    // Datos del horario asignado
    private UUID idHorario;
    private String nombreDocente;
    private String codigoAula;
    private Short diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
}