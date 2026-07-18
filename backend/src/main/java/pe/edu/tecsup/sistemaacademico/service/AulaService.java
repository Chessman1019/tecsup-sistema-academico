package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.AulaRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.AulaResponse;

import java.util.List;
import java.util.UUID;

public interface AulaService {

    List<AulaResponse> listarTodas();

    AulaResponse crear(AulaRequest request);

    AulaResponse actualizar(UUID idAula, AulaRequest request);
}