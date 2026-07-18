package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Docente;

import java.util.Optional;
import java.util.UUID;

public interface DocenteRepository extends JpaRepository<Docente, UUID> {

    Optional<Docente> findByCodigoDocente(String codigoDocente);

    Optional<Docente> findByUsuario_IdUsuario(UUID idUsuario);

    Optional<Docente> findByUsuario_Username(String username);
}