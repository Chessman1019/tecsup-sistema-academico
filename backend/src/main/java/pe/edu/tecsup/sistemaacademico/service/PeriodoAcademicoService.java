package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.PeriodoAcademicoRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.PeriodoAcademicoResponse;

import java.util.List;
import java.util.UUID;

public interface PeriodoAcademicoService {

    List<PeriodoAcademicoResponse> listarTodos();

    PeriodoAcademicoResponse crear(PeriodoAcademicoRequest request);

    PeriodoAcademicoResponse actualizar(UUID idPeriodo, PeriodoAcademicoRequest request);
}