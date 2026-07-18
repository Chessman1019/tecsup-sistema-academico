
package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Sede;

import java.util.UUID;

public interface SedeRepository extends JpaRepository<Sede, UUID> {
}