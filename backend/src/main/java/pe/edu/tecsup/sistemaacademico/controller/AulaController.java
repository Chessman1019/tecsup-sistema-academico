package pe.edu.tecsup.sistemaacademico.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.request.AulaRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.AulaResponse;
import pe.edu.tecsup.sistemaacademico.service.AulaService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/aulas")
@RequiredArgsConstructor
public class AulaController {

    private final AulaService aulaService;

    @GetMapping
    public ResponseEntity<List<AulaResponse>> listarTodas() {
        return ResponseEntity.ok(aulaService.listarTodas());
    }

    @PostMapping
    public ResponseEntity<AulaResponse> crear(@Valid @RequestBody AulaRequest request) {
        AulaResponse response = aulaService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{idAula}")
    public ResponseEntity<AulaResponse> actualizar(
            @PathVariable UUID idAula,
            @Valid @RequestBody AulaRequest request) {
        return ResponseEntity.ok(aulaService.actualizar(idAula, request));
    }
}