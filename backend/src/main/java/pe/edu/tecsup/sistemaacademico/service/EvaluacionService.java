package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.EvaluacionRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.EvaluacionResponse;

import java.util.List;
import java.util.UUID;

public interface EvaluacionService {

    EvaluacionResponse crear(EvaluacionRequest request);

    List<EvaluacionResponse> listarPorCurso(UUID idCurso);
}