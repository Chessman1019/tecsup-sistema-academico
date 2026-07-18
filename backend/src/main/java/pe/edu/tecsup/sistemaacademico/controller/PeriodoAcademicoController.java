package pe.edu.tecsup.sistemaacademico.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.request.PeriodoAcademicoRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.PeriodoAcademicoResponse;
import pe.edu.tecsup.sistemaacademico.service.PeriodoAcademicoService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/periodos-academicos")
@RequiredArgsConstructor
public class PeriodoAcademicoController {

    private final PeriodoAcademicoService periodoAcademicoService;

    @GetMapping
    public ResponseEntity<List<PeriodoAcademicoResponse>> listarTodos() {
        return ResponseEntity.ok(periodoAcademicoService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<PeriodoAcademicoResponse> crear(@Valid @RequestBody PeriodoAcademicoRequest request) {
        PeriodoAcademicoResponse response = periodoAcademicoService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{idPeriodo}")
    public ResponseEntity<PeriodoAcademicoResponse> actualizar(
            @PathVariable UUID idPeriodo,
            @Valid @RequestBody PeriodoAcademicoRequest request) {
        return ResponseEntity.ok(periodoAcademicoService.actualizar(idPeriodo, request));
    }
}