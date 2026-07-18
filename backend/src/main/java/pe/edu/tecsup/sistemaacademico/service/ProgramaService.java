package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.ProgramaRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.ProgramaResponse;

import java.util.List;
import java.util.UUID;

public interface ProgramaService {

    List<ProgramaResponse> listarTodos();

    ProgramaResponse crear(ProgramaRequest request);

    ProgramaResponse actualizar(UUID idPrograma, ProgramaRequest request);

    void cambiarEstado(UUID idPrograma, boolean estado);
}