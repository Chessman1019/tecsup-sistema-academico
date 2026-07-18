package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.MaterialRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.MaterialResponse;

import java.util.List;
import java.util.UUID;

public interface MaterialService {

    MaterialResponse crear(MaterialRequest request, String usernameDocente);

    List<MaterialResponse> listarPorCurso(UUID idCurso);

    List<MaterialResponse> listarPorDocente(UUID idDocente);

    void eliminar(UUID idMaterial);
}