package pe.edu.tecsup.sistemaacademico.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.request.AsistenciaRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.AsistenciaResponse;
import pe.edu.tecsup.sistemaacademico.dto.response.PorcentajeAsistenciaResponse;
import pe.edu.tecsup.sistemaacademico.service.AsistenciaService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/asistencias")
@RequiredArgsConstructor
public class AsistenciaController {

    private final AsistenciaService asistenciaService;

    @PostMapping
    public ResponseEntity<AsistenciaResponse> registrar(@Valid @RequestBody AsistenciaRequest request) {
        return ResponseEntity.ok(asistenciaService.registrarAsistencia(request));
    }

    @GetMapping("/matricula/{idMatricula}")
    public ResponseEntity<List<AsistenciaResponse>> listarPorMatricula(@PathVariable UUID idMatricula) {
        return ResponseEntity.ok(asistenciaService.listarPorMatricula(idMatricula));
    }

    @GetMapping("/sesion/{idSesion}")
    public ResponseEntity<List<AsistenciaResponse>> listarPorSesion(@PathVariable UUID idSesion) {
        return ResponseEntity.ok(asistenciaService.listarPorSesion(idSesion));
    }

    @GetMapping("/matricula/{idMatricula}/porcentaje")
    public ResponseEntity<PorcentajeAsistenciaResponse> porcentaje(@PathVariable UUID idMatricula) {
        return ResponseEntity.ok(asistenciaService.calcularPorcentaje(idMatricula));
    }
}