package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class NotificacionResponse {
    private UUID idNotificacion;
    private String titulo;
    private String mensaje;
    private LocalDateTime fechaEnvio;
    private Boolean leida;
}