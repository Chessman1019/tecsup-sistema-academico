package pe.edu.tecsup.sistemaacademico.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.request.EvaluacionRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.EvaluacionResponse;
import pe.edu.tecsup.sistemaacademico.service.EvaluacionService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/evaluaciones")
@RequiredArgsConstructor
public class EvaluacionController {

    private final EvaluacionService evaluacionService;

    @PostMapping
    public ResponseEntity<EvaluacionResponse> crear(@Valid @RequestBody EvaluacionRequest request) {
        EvaluacionResponse response = evaluacionService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/curso/{idCurso}")
    public ResponseEntity<List<EvaluacionResponse>> listarPorCurso(@PathVariable UUID idCurso) {
        return ResponseEntity.ok(evaluacionService.listarPorCurso(idCurso));
    }
}