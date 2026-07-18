package pe.edu.tecsup.sistemaacademico.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.tecsup.sistemaacademico.dto.response.DocenteResponse;
import pe.edu.tecsup.sistemaacademico.service.DocenteService;

import java.util.List;

@RestController
@RequestMapping("/docentes")
@RequiredArgsConstructor
public class DocenteController {

    private final DocenteService docenteService;

    @GetMapping("/me")
    public ResponseEntity<DocenteResponse> obtenerMiPerfil(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(docenteService.obtenerPerfilPorUsername(username));
    }

    @GetMapping
    public ResponseEntity<List<DocenteResponse>> listarTodos() {
        return ResponseEntity.ok(docenteService.listarTodos());
    }
}