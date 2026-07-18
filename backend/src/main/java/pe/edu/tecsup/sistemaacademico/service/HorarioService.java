package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.HorarioRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.HorarioResponse;

import java.util.List;
import java.util.UUID;

public interface HorarioService {

    HorarioResponse crearHorario(HorarioRequest request);

    List<HorarioResponse> listarTodos();

    List<HorarioResponse> listarPorCurso(UUID idCurso);

    List<HorarioResponse> listarPorDocente(UUID idDocente);
}