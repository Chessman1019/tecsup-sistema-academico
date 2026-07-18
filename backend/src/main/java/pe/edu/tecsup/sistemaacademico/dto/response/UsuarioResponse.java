package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class UsuarioResponse {
    private UUID idUsuario;
    private String username;
    private String rol;
    private Boolean estado;
    private LocalDateTime ultimoAcceso;
}