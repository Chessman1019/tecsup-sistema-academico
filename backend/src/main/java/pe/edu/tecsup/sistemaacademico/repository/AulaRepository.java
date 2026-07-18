package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Aula;

import java.util.Optional;
import java.util.UUID;

public interface AulaRepository extends JpaRepository<Aula, UUID> {

    Optional<Aula> findByCodigo(String codigo);
}