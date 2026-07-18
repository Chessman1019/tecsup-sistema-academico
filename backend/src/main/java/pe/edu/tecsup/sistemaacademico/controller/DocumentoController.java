package pe.edu.tecsup.sistemaacademico.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.tecsup.sistemaacademico.dto.response.DocumentoResponse;
import pe.edu.tecsup.sistemaacademico.repository.EstudianteRepository;
import pe.edu.tecsup.sistemaacademico.service.DocumentoService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/documentos")
@RequiredArgsConstructor
public class DocumentoController {

    private final DocumentoService documentoService;
    private final EstudianteRepository estudianteRepository;

    @GetMapping("/me")
    public ResponseEntity<List<DocumentoResponse>> obtenerMisDocumentos(Authentication authentication) {
        String username = authentication.getName();
        UUID idEstudiante = estudianteRepository.findByUsuario_Username(username)
                .orElseThrow()
                .getIdEstudiante();
        return ResponseEntity.ok(documentoService.listarPorEstudiante(idEstudiante));
    }

    @GetMapping
    public ResponseEntity<List<DocumentoResponse>> listarTodos() {
        return ResponseEntity.ok(documentoService.listarTodos());
    }

    @GetMapping("/estudiante/{idEstudiante}")
    public ResponseEntity<List<DocumentoResponse>> listarPorEstudiante(@PathVariable UUID idEstudiante) {
        return ResponseEntity.ok(documentoService.listarPorEstudiante(idEstudiante));
    }
}