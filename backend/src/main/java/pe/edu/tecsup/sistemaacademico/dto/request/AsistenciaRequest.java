package pe.edu.tecsup.sistemaacademico.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import pe.edu.tecsup.sistemaacademico.model.enums.EstadoAsistencia;

import java.util.UUID;

@Getter
@Setter
public class AsistenciaRequest {

    @NotNull(message = "La matricula es obligatoria")
    private UUID idMatricula;

    @NotNull(message = "La sesion es obligatoria")
    private UUID idSesion;

    @NotNull(message = "El estado de asistencia es obligatorio")
    private EstadoAsistencia estado; // P, A, T

    private String observacion;
}