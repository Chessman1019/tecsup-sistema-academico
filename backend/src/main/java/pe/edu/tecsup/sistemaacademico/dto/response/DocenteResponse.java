package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class DocenteResponse {
    private UUID idDocente;
    private String codigoDocente;
    private String nombres;
    private String apellidos;
    private String correo;
    private String especialidad;
    private String categoria;
}