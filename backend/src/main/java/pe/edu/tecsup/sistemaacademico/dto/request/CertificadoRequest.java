package pe.edu.tecsup.sistemaacademico.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CertificadoRequest {

    @NotNull(message = "El estudiante es obligatorio")
    private UUID idEstudiante;

    @NotBlank(message = "El tipo de certificado es obligatorio")
    private String tipo; // Ej: "Constancia de matricula", "Certificado de estudios"
}