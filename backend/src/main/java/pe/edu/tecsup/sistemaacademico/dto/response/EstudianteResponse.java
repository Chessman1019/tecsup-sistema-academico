package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class EstudianteResponse {
    private UUID idEstudiante;
    private String codigoAlumno;
    private String nombres;
    private String apellidos;
    private String correo;
    private Short cicloActual;
    private Boolean estado;
}