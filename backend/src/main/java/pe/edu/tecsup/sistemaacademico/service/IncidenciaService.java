package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.IncidenciaRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.IncidenciaResponse;

import java.util.List;
import java.util.UUID;

public interface IncidenciaService {

    IncidenciaResponse crear(IncidenciaRequest request);

    List<IncidenciaResponse> listarTodas();

    IncidenciaResponse cambiarEstado(UUID idIncidencia, String nuevoEstado);
}