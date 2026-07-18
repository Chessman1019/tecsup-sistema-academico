package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.MatriculaRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.MatriculaResponse;

import java.util.List;
import java.util.UUID;

public interface MatriculaService {

    MatriculaResponse matricular(MatriculaRequest request);

    List<MatriculaResponse> listarTodas();

    List<MatriculaResponse> listarPorEstudiante(UUID idEstudiante);

    List<MatriculaResponse> listarPorHorario(UUID idHorario);

    MatriculaResponse retirarMatricula(UUID idMatricula);
}