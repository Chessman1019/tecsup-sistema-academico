package pe.edu.tecsup.sistemaacademico.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.request.CalificacionRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.CalificacionResponse;
import pe.edu.tecsup.sistemaacademico.security.OwnershipService;
import pe.edu.tecsup.sistemaacademico.service.CalificacionService;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/calificaciones")
@RequiredArgsConstructor
public class CalificacionController {

    private final CalificacionService calificacionService;
    private final OwnershipService ownershipService;

    @PostMapping
    public ResponseEntity<CalificacionResponse> registrar(@Valid @RequestBody CalificacionRequest request) {
        return ResponseEntity.ok(calificacionService.registrarNota(request));
    }

    @GetMapping("/matricula/{idMatricula}")
    public ResponseEntity<List<CalificacionResponse>> listarPorMatricula(
            @PathVariable UUID idMatricula,
            Authentication authentication) {
        // Anti-IDOR: si es ESTUDIANTE, la matricula debe ser suya
        ownershipService.verificarPropietarioMatricula(idMatricula, authentication);
        return ResponseEntity.ok(calificacionService.listarPorMatricula(idMatricula));
    }

    @GetMapping("/matricula/{idMatricula}/promedio")
    public ResponseEntity<BigDecimal> promedio(
            @PathVariable UUID idMatricula,
            Authentication authentication) {
        ownershipService.verificarPropietarioMatricula(idMatricula, authentication);
        return ResponseEntity.ok(calificacionService.calcularPromedioPonderado(idMatricula));
    }
}