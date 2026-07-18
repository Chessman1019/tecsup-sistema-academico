package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class AuditoriaResponse {
    private UUID idAuditoria;
    private String accion;
    private String entidad;
    private String detalle;
    private String username;
    private LocalDateTime fecha;
}