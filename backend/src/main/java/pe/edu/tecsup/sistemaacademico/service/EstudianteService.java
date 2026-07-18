package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.response.EstudianteResponse;

import java.util.List;

public interface EstudianteService {

    EstudianteResponse obtenerPerfilPorUsername(String username);

    List<EstudianteResponse> listarTodos();
}