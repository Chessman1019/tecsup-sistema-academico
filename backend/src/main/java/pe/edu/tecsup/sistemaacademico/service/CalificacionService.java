package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.CalificacionRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.CalificacionResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface CalificacionService {

    CalificacionResponse registrarNota(CalificacionRequest request);

    List<CalificacionResponse> listarPorMatricula(UUID idMatricula);

    BigDecimal calcularPromedioPonderado(UUID idMatricula);
}