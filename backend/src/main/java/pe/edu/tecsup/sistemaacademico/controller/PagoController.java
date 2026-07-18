package pe.edu.tecsup.sistemaacademico.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.tecsup.sistemaacademico.dto.response.PagoResponse;
import pe.edu.tecsup.sistemaacademico.repository.EstudianteRepository;
import pe.edu.tecsup.sistemaacademico.service.PagoService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/pagos")
@RequiredArgsConstructor
public class PagoController {

    private final PagoService pagoService;
    private final EstudianteRepository estudianteRepository;

    @GetMapping("/me")
    public ResponseEntity<List<PagoResponse>> obtenerMisPagos(Authentication authentication) {
        String username = authentication.getName();
        UUID idEstudiante = estudianteRepository.findByUsuario_Username(username)
                .orElseThrow()
                .getIdEstudiante();
        return ResponseEntity.ok(pagoService.listarPorEstudiante(idEstudiante));
    }

    @GetMapping
    public ResponseEntity<List<PagoResponse>> listarTodos() {
        return ResponseEntity.ok(pagoService.listarTodos());
    }

    @GetMapping("/estudiante/{idEstudiante}")
    public ResponseEntity<List<PagoResponse>> listarPorEstudiante(@PathVariable UUID idEstudiante) {
        return ResponseEntity.ok(pagoService.listarPorEstudiante(idEstudiante));
    }
}