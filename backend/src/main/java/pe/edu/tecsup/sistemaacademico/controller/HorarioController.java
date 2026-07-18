package pe.edu.tecsup.sistemaacademico.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.request.HorarioRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.HorarioResponse;
import pe.edu.tecsup.sistemaacademico.service.HorarioService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/horarios")
@RequiredArgsConstructor
public class HorarioController {

    private final HorarioService horarioService;

    @PostMapping
    public ResponseEntity<HorarioResponse> crear(@Valid @RequestBody HorarioRequest request) {
        HorarioResponse response = horarioService.crearHorario(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<HorarioResponse>> listarTodos() {
        return ResponseEntity.ok(horarioService.listarTodos());
    }

    @GetMapping("/curso/{idCurso}")
    public ResponseEntity<List<HorarioResponse>> listarPorCurso(@PathVariable UUID idCurso) {
        return ResponseEntity.ok(horarioService.listarPorCurso(idCurso));
    }

    @GetMapping("/docente/{idDocente}")
    public ResponseEntity<List<HorarioResponse>> listarPorDocente(@PathVariable UUID idDocente) {
        return ResponseEntity.ok(horarioService.listarPorDocente(idDocente));
    }
}