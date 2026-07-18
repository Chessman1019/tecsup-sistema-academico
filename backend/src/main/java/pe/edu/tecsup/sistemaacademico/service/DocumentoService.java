package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.response.DocumentoResponse;

import java.util.List;
import java.util.UUID;

public interface DocumentoService {

    List<DocumentoResponse> listarTodos();

    List<DocumentoResponse> listarPorEstudiante(UUID idEstudiante);
}