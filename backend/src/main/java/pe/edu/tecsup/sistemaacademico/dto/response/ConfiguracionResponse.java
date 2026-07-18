package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class ConfiguracionResponse {

    private UUID idConfiguracion;
    private String clave;
    private String valor;
    private String descripcion;
    private String categoria;
}