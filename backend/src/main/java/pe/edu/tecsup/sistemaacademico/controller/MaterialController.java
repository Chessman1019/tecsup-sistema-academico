package pe.edu.tecsup.sistemaacademico.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.request.MaterialRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.MaterialResponse;
import pe.edu.tecsup.sistemaacademico.service.MaterialService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/materiales")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    @PostMapping
    public ResponseEntity<MaterialResponse> crear(
            @Valid @RequestBody MaterialRequest request,
            Authentication authentication) {
        MaterialResponse response = materialService.crear(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/curso/{idCurso}")
    public ResponseEntity<List<MaterialResponse>> listarPorCurso(@PathVariable UUID idCurso) {
        return ResponseEntity.ok(materialService.listarPorCurso(idCurso));
    }

    @GetMapping("/docente/{idDocente}")
    public ResponseEntity<List<MaterialResponse>> listarPorDocente(@PathVariable UUID idDocente) {
        return ResponseEntity.ok(materialService.listarPorDocente(idDocente));
    }

    @DeleteMapping("/{idMaterial}")
    public ResponseEntity<Void> eliminar(@PathVariable UUID idMaterial) {
        materialService.eliminar(idMaterial);
        return ResponseEntity.noContent().build();
    }
}