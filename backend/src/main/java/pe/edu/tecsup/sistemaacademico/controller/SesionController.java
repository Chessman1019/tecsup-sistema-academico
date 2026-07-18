package pe.edu.tecsup.sistemaacademico.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.response.SesionResponse;
import pe.edu.tecsup.sistemaacademico.service.SesionService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/sesiones")
@RequiredArgsConstructor
public class SesionController {

    private final SesionService sesionService;

    @PostMapping("/horario/{idHorario}/hoy")
    public ResponseEntity<SesionResponse> obtenerOCrearSesionDeHoy(@PathVariable UUID idHorario) {
        return ResponseEntity.ok(sesionService.obtenerOCrearSesionDeHoy(idHorario));
    }

    @GetMapping("/horario/{idHorario}")
    public ResponseEntity<List<SesionResponse>> listarPorHorario(@PathVariable UUID idHorario) {
        return ResponseEntity.ok(sesionService.listarPorHorario(idHorario));
    }
}