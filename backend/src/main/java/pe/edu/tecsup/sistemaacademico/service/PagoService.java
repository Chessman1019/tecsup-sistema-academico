package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.response.PagoResponse;

import java.util.List;
import java.util.UUID;

public interface PagoService {

    List<PagoResponse> listarTodos();

    List<PagoResponse> listarPorEstudiante(UUID idEstudiante);
}