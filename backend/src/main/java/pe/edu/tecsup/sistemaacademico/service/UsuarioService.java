package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.UsuarioRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.UsuarioResponse;

import java.util.List;
import java.util.UUID;

public interface UsuarioService {

    List<UsuarioResponse> listarTodos();

    UsuarioResponse obtenerPorId(UUID idUsuario);

    UsuarioResponse crear(UsuarioRequest request);

    UsuarioResponse actualizar(UUID idUsuario, UsuarioRequest request);

    void cambiarEstado(UUID idUsuario, boolean estado);

    void eliminar(UUID idUsuario);

    String obtenerFoto(String username);

    void actualizarFoto(String username, String foto);
}