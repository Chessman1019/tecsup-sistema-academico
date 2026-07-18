package pe.edu.tecsup.sistemaacademico.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.request.ConfiguracionRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.ConfiguracionResponse;
import pe.edu.tecsup.sistemaacademico.service.ConfiguracionService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/configuracion")
@RequiredArgsConstructor
public class ConfiguracionController {

    private final ConfiguracionService configuracionService;

    @GetMapping
    public ResponseEntity<List<ConfiguracionResponse>> listarTodas() {
        return ResponseEntity.ok(configuracionService.listarTodas());
    }

    @PutMapping("/{idConfiguracion}")
    public ResponseEntity<ConfiguracionResponse> actualizarValor(
            @PathVariable UUID idConfiguracion,
            @Valid @RequestBody ConfiguracionRequest request) {
        return ResponseEntity.ok(configuracionService.actualizarValor(idConfiguracion, request));
    }
}