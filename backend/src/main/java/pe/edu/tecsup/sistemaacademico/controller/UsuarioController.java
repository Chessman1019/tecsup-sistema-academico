package pe.edu.tecsup.sistemaacademico.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.request.UsuarioRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.UsuarioResponse;
import pe.edu.tecsup.sistemaacademico.service.UsuarioService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/me/foto")
    public ResponseEntity<Map<String, String>> obtenerMiFoto(Authentication authentication) {
        String foto = usuarioService.obtenerFoto(authentication.getName());
        return ResponseEntity.ok(Map.of("foto", foto != null ? foto : ""));
    }

    @PutMapping("/me/foto")
    public ResponseEntity<Void> actualizarMiFoto(
            Authentication authentication,
            @RequestBody Map<String, String> body) {
        usuarioService.actualizarFoto(authentication.getName(), body.get("foto"));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{idUsuario}")
    public ResponseEntity<UsuarioResponse> obtenerPorId(@PathVariable UUID idUsuario) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(idUsuario));
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> crear(@Valid @RequestBody UsuarioRequest request) {
        UsuarioResponse response = usuarioService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{idUsuario}")
    public ResponseEntity<UsuarioResponse> actualizar(
            @PathVariable UUID idUsuario,
            @Valid @RequestBody UsuarioRequest request) {
        return ResponseEntity.ok(usuarioService.actualizar(idUsuario, request));
    }

    @PatchMapping("/{idUsuario}/estado")
    public ResponseEntity<Void> cambiarEstado(
            @PathVariable UUID idUsuario,
            @RequestBody Map<String, Boolean> body) {
        boolean estado = Boolean.TRUE.equals(body.get("estado"));
        usuarioService.cambiarEstado(idUsuario, estado);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping(("/{idUsuario}"))
    public ResponseEntity<Void> eliminar(@PathVariable UUID idUsuario) {
        usuarioService.eliminar(idUsuario);
        return ResponseEntity.noContent().build();
    }
}