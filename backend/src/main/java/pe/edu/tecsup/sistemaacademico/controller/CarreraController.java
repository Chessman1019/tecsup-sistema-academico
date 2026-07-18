package pe.edu.tecsup.sistemaacademico.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.request.CarreraRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.CarreraResponse;
import pe.edu.tecsup.sistemaacademico.service.CarreraService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/carreras")
@RequiredArgsConstructor
public class CarreraController {

    private final CarreraService carreraService;

    @GetMapping
    public ResponseEntity<List<CarreraResponse>> listarTodas() {
        return ResponseEntity.ok(carreraService.listarTodas());
    }

    @PostMapping
    public ResponseEntity<CarreraResponse> crear(@Valid @RequestBody CarreraRequest request) {
        CarreraResponse response = carreraService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{idCarrera}")
    public ResponseEntity<CarreraResponse> actualizar(
            @PathVariable UUID idCarrera,
            @Valid @RequestBody CarreraRequest request) {
        return ResponseEntity.ok(carreraService.actualizar(idCarrera, request));
    }

    @PatchMapping("/{idCarrera}/estado")
    public ResponseEntity<Void> cambiarEstado(
            @PathVariable UUID idCarrera,
            @RequestBody Map<String, Boolean> body) {
        boolean estado = Boolean.TRUE.equals(body.get("estado"));
        carreraService.cambiarEstado(idCarrera, estado);
        return ResponseEntity.noContent().build();
    }
}