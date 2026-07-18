package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class CertificadoResponse {
    private UUID idCertificado;
    private String nombreEstudiante;
    private String tipo;
    private LocalDate fechaSolicitud;
    private LocalDate fechaEmision;
    private String estado;
    private String urlDoc;
}