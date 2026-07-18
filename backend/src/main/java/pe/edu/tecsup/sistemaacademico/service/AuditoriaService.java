package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.response.AuditoriaResponse;

import java.util.List;

public interface AuditoriaService {

    void registrar(String accion, String entidad, String detalle, String username);

    List<AuditoriaResponse> listarTodas();
}