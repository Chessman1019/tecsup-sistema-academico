package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.response.NotificacionResponse;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Notificacion;
import pe.edu.tecsup.sistemaacademico.model.Usuario;
import pe.edu.tecsup.sistemaacademico.repository.NotificacionRepository;
import pe.edu.tecsup.sistemaacademico.repository.UsuarioRepository;
import pe.edu.tecsup.sistemaacademico.service.NotificacionService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificacionServiceImpl implements NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public void notificar(UUID idUsuario, String titulo, String mensaje) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario no encontrado: " + idUsuario));

        Notificacion notificacion = Notificacion.builder()
                .usuario(usuario)
                .titulo(titulo)
                .mensaje(mensaje)
                .fechaEnvio(LocalDateTime.now())
                .leida(false)
                .build();

        notificacionRepository.save(notificacion);
    }

    @Override
    public List<NotificacionResponse> listarPorUsuario(UUID idUsuario) {
        return notificacionRepository.findByUsuario_IdUsuarioOrderByFechaEnvioDesc(idUsuario)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificacionResponse> listarPorUsername(String username) {
        return notificacionRepository.findByUsuarioUsernameOrderByFechaEnvioDesc(username)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void marcarComoLeida(UUID idNotificacion) {
        Notificacion notificacion = notificacionRepository.findById(idNotificacion)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Notificacion no encontrada: " + idNotificacion));
        notificacion.setLeida(true);
        notificacionRepository.save(notificacion);
    }

    private NotificacionResponse toResponse(Notificacion n) {
        return NotificacionResponse.builder()
                .idNotificacion(n.getIdNotificacion())
                .titulo(n.getTitulo())
                .mensaje(n.getMensaje())
                .fechaEnvio(n.getFechaEnvio())
                .leida(n.getLeida())
                .build();
    }
}