package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.AsistenciaRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.AsistenciaResponse;
import pe.edu.tecsup.sistemaacademico.dto.response.PorcentajeAsistenciaResponse;

import java.util.List;
import java.util.UUID;

public interface AsistenciaService {

    AsistenciaResponse registrarAsistencia(AsistenciaRequest request);

    List<AsistenciaResponse> listarPorMatricula(UUID idMatricula);

    List<AsistenciaResponse> listarPorSesion(UUID idSesion);

    PorcentajeAsistenciaResponse calcularPorcentaje(UUID idMatricula);
}