package pe.edu.tecsup.sistemaacademico.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.request.CursoRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.CursoResponse;
import pe.edu.tecsup.sistemaacademico.service.CursoService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/cursos")
@RequiredArgsConstructor
public class CursoController {

    private final CursoService cursoService;

    @GetMapping
    public ResponseEntity<List<CursoResponse>> listarTodos() {
        return ResponseEntity.ok(cursoService.listarTodos());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<CursoResponse>> listarActivos() {
        return ResponseEntity.ok(cursoService.listarActivos());
    }

    @PostMapping
    public ResponseEntity<CursoResponse> crear(@Valid @RequestBody CursoRequest request) {
        CursoResponse response = cursoService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{idCurso}")
    public ResponseEntity<CursoResponse> actualizar(
            @PathVariable UUID idCurso,
            @Valid @RequestBody CursoRequest request) {
        return ResponseEntity.ok(cursoService.actualizar(idCurso, request));
    }

    @PatchMapping("/{idCurso}/estado")
    public ResponseEntity<Void> cambiarEstado(
            @PathVariable UUID idCurso,
            @RequestBody Map<String, Boolean> body) {
        boolean estado = Boolean.TRUE.equals(body.get("estado"));
        cursoService.cambiarEstado(idCurso, estado);
        return ResponseEntity.noContent().build();
    }
}