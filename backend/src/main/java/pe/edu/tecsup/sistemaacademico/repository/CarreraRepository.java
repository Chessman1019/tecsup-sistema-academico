package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Carrera;

import java.util.UUID;

public interface CarreraRepository extends JpaRepository<Carrera, UUID> {

    boolean existsByCodigo(String codigo);
}