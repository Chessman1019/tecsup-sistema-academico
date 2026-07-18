package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.SedeRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.SedeResponse;

import java.util.List;
import java.util.UUID;

public interface SedeService {

    List<SedeResponse> listarTodas();

    SedeResponse crear(SedeRequest request);

    SedeResponse actualizar(UUID idSede, SedeRequest request);

    void cambiarEstado(UUID idSede, boolean estado);
}