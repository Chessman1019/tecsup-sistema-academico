package pe.edu.tecsup.sistemaacademico.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.request.ProgramaRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.ProgramaResponse;
import pe.edu.tecsup.sistemaacademico.service.ProgramaService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/programas")
@RequiredArgsConstructor
public class ProgramaController {

    private final ProgramaService programaService;

    @GetMapping
    public ResponseEntity<List<ProgramaResponse>> listarTodos() {
        return ResponseEntity.ok(programaService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<ProgramaResponse> crear(@Valid @RequestBody ProgramaRequest request) {
        ProgramaResponse response = programaService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{idPrograma}")
    public ResponseEntity<ProgramaResponse> actualizar(
            @PathVariable UUID idPrograma,
            @Valid @RequestBody ProgramaRequest request) {
        return ResponseEntity.ok(programaService.actualizar(idPrograma, request));
    }

    @PatchMapping("/{idPrograma}/estado")
    public ResponseEntity<Void> cambiarEstado(
            @PathVariable UUID idPrograma,
            @RequestBody Map<String, Boolean> body) {
        boolean estado = Boolean.TRUE.equals(body.get("estado"));
        programaService.cambiarEstado(idPrograma, estado);
        return ResponseEntity.noContent().build();
    }
}