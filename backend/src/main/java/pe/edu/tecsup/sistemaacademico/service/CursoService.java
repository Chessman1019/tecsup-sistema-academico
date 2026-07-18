package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.CursoRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.CursoResponse;

import java.util.List;
import java.util.UUID;

public interface CursoService {

    List<CursoResponse> listarTodos();

    List<CursoResponse> listarActivos();

    CursoResponse crear(CursoRequest request);

    CursoResponse actualizar(UUID idCurso, CursoRequest request);

    void cambiarEstado(UUID idCurso, boolean estado);
}