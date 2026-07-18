package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.response.NotificacionResponse;

import java.util.List;
import java.util.UUID;

public interface NotificacionService {

    void notificar(UUID idUsuario, String titulo, String mensaje);

    List<NotificacionResponse> listarPorUsuario(UUID idUsuario);

    List<NotificacionResponse> listarPorUsername(String username);

    void marcarComoLeida(UUID idNotificacion);
}