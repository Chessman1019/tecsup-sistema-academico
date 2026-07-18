package pe.edu.tecsup.sistemaacademico.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.request.MatriculaRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.MatriculaResponse;
import pe.edu.tecsup.sistemaacademico.service.MatriculaService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/matriculas")
@RequiredArgsConstructor
public class MatriculaController {

    private final MatriculaService matriculaService;

    @PostMapping
    public ResponseEntity<MatriculaResponse> matricular(@Valid @RequestBody MatriculaRequest request) {
        MatriculaResponse response = matriculaService.matricular(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<MatriculaResponse>> listarTodas() {
        return ResponseEntity.ok(matriculaService.listarTodas());
    }

    @GetMapping("/estudiante/{idEstudiante}")
    public ResponseEntity<List<MatriculaResponse>> listarPorEstudiante(@PathVariable UUID idEstudiante) {
        return ResponseEntity.ok(matriculaService.listarPorEstudiante(idEstudiante));
    }

    @GetMapping("/horario/{idHorario}")
    public ResponseEntity<List<MatriculaResponse>> listarPorHorario(@PathVariable UUID idHorario) {
        return ResponseEntity.ok(matriculaService.listarPorHorario(idHorario));
    }

    @PatchMapping("/{idMatricula}/retirar")
    public ResponseEntity<MatriculaResponse> retirar(@PathVariable UUID idMatricula) {
        return ResponseEntity.ok(matriculaService.retirarMatricula(idMatricula));
    }
}