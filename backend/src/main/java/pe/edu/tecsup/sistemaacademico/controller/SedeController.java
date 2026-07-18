package pe.edu.tecsup.sistemaacademico.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.request.SedeRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.SedeResponse;
import pe.edu.tecsup.sistemaacademico.service.SedeService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/sedes")
@RequiredArgsConstructor
public class SedeController {

    private final SedeService sedeService;

    @GetMapping
    public ResponseEntity<List<SedeResponse>> listarTodas() {
        return ResponseEntity.ok(sedeService.listarTodas());
    }

    @PostMapping
    public ResponseEntity<SedeResponse> crear(@Valid @RequestBody SedeRequest request) {
        SedeResponse response = sedeService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{idSede}")
    public ResponseEntity<SedeResponse> actualizar(
            @PathVariable UUID idSede,
            @Valid @RequestBody SedeRequest request) {
        return ResponseEntity.ok(sedeService.actualizar(idSede, request));
    }

    @PatchMapping("/{idSede}/estado")
    public ResponseEntity<Void> cambiarEstado(
            @PathVariable UUID idSede,
            @RequestBody Map<String, Boolean> body) {
        boolean estado = Boolean.TRUE.equals(body.get("estado"));
        sedeService.cambiarEstado(idSede, estado);
        return ResponseEntity.noContent().build();
    }
}