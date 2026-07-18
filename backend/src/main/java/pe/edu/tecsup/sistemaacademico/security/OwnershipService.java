package pe.edu.tecsup.sistemaacademico.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Matricula;
import pe.edu.tecsup.sistemaacademico.repository.MatriculaRepository;

import java.util.UUID;

/**
 * Verificacion de propiedad de recursos (anti-IDOR).
 * Las reglas de SecurityConfig deciden QUIEN entra a un endpoint,
 * pero no verifican si el recurso pedido pertenece al usuario.
 * Este servicio cierra esa brecha para el rol ESTUDIANTE.
 */
@Service
@RequiredArgsConstructor
public class OwnershipService {

    private final MatriculaRepository matriculaRepository;

    private static final String ROLE_ESTUDIANTE = "ROLE_ESTUDIANTE";

    /**
     * Lanza 403 si el usuario es ESTUDIANTE y la matricula no es suya.
     * Los roles de staff pasan directo (ya filtrados por SecurityConfig).
     */
    public void verificarPropietarioMatricula(UUID idMatricula, Authentication authentication) {
        if (!esEstudiante(authentication)) {
            return;
        }

        Matricula matricula = matriculaRepository.findById(idMatricula)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Matricula no encontrada: " + idMatricula));

        String usernameDuenio = matricula.getEstudiante().getUsuario().getUsername();
        if (!usernameDuenio.equalsIgnoreCase(authentication.getName())) {
            throw new AccessDeniedException("No tienes permiso para acceder a este recurso");
        }
    }

    private boolean esEstudiante(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> ROLE_ESTUDIANTE.equals(a.getAuthority()));
    }
}