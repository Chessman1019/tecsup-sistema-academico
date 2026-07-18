package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Estudiante;

import java.util.Optional;
import java.util.UUID;

public interface EstudianteRepository extends JpaRepository<Estudiante, UUID> {

    Optional<Estudiante> findByCodigoAlumno(String codigoAlumno);

    Optional<Estudiante> findByUsuario_IdUsuario(UUID idUsuario);

    Optional<Estudiante> findByUsuario_Username(String username);

    Optional<Estudiante> findByCorreo(String correo);
}