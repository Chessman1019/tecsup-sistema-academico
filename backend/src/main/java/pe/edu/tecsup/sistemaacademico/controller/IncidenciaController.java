package pe.edu.tecsup.sistemaacademico.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.request.IncidenciaRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.IncidenciaResponse;
import pe.edu.tecsup.sistemaacademico.service.IncidenciaService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/incidencias")
@RequiredArgsConstructor
public class IncidenciaController {

    private final IncidenciaService incidenciaService;

    @PostMapping
    public ResponseEntity<IncidenciaResponse> crear(@Valid @RequestBody IncidenciaRequest request) {
        IncidenciaResponse response = incidenciaService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<IncidenciaResponse>> listarTodas() {
        return ResponseEntity.ok(incidenciaService.listarTodas());
    }

    @PatchMapping("/{idIncidencia}/estado")
    public ResponseEntity<IncidenciaResponse> cambiarEstado(
            @PathVariable UUID idIncidencia,
            @RequestBody Map<String, String> body) {
        String nuevoEstado = body.get("estado");
        return ResponseEntity.ok(incidenciaService.cambiarEstado(idIncidencia, nuevoEstado));
    }
}