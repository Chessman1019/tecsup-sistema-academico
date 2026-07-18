package pe.edu.tecsup.sistemaacademico.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.tecsup.sistemaacademico.dto.request.CertificadoRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.CertificadoResponse;
import pe.edu.tecsup.sistemaacademico.service.CertificadoService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/certificados")
@RequiredArgsConstructor
public class CertificadoController {

    private final CertificadoService certificadoService;

    @PostMapping
    public ResponseEntity<CertificadoResponse> solicitar(@Valid @RequestBody CertificadoRequest request) {
        CertificadoResponse response = certificadoService.solicitar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{idCertificado}/emitir")
    public ResponseEntity<CertificadoResponse> emitir(
            @PathVariable UUID idCertificado,
            @RequestParam String urlDoc) {
        return ResponseEntity.ok(certificadoService.emitir(idCertificado, urlDoc));
    }

    @GetMapping
    public ResponseEntity<List<CertificadoResponse>> listarTodos() {
        return ResponseEntity.ok(certificadoService.listarTodos());
    }

    @GetMapping("/estudiante/{idEstudiante}")
    public ResponseEntity<List<CertificadoResponse>> listarPorEstudiante(@PathVariable UUID idEstudiante) {
        return ResponseEntity.ok(certificadoService.listarPorEstudiante(idEstudiante));
    }
}