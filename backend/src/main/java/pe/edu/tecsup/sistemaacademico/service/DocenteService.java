package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.response.DocenteResponse;

import java.util.List;

public interface DocenteService {

    DocenteResponse obtenerPerfilPorUsername(String username);

    List<DocenteResponse> listarTodos();
}