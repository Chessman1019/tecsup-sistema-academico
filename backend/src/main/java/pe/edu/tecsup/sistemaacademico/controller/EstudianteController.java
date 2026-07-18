package pe.edu.tecsup.sistemaacademico.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.tecsup.sistemaacademico.dto.response.EstudianteResponse;
import pe.edu.tecsup.sistemaacademico.service.EstudianteService;

import java.util.List;

@RestController
@RequestMapping("/estudiantes")
@RequiredArgsConstructor
public class EstudianteController {

    private final EstudianteService estudianteService;

    @GetMapping("/me")
    public ResponseEntity<EstudianteResponse> obtenerMiPerfil(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(estudianteService.obtenerPerfilPorUsername(username));
    }

    @GetMapping
    public ResponseEntity<List<EstudianteResponse>> listarTodos() {
        return ResponseEntity.ok(estudianteService.listarTodos());
    }
}