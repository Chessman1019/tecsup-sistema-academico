package pe.edu.tecsup.sistemaacademico.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.response.NotificacionResponse;
import pe.edu.tecsup.sistemaacademico.service.NotificacionService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {

    private final NotificacionService notificacionService;

    @GetMapping("/me")
    public ResponseEntity<List<NotificacionResponse>> obtenerMisNotificaciones(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(notificacionService.listarPorUsername(username));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<NotificacionResponse>> listarPorUsuario(@PathVariable UUID idUsuario) {
        return ResponseEntity.ok(notificacionService.listarPorUsuario(idUsuario));
    }

    @PatchMapping("/{idNotificacion}/leida")
    public ResponseEntity<Void> marcarComoLeida(@PathVariable UUID idNotificacion) {
        notificacionService.marcarComoLeida(idNotificacion);
        return ResponseEntity.noContent().build();
    }
}