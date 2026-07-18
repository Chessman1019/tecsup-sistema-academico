package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Incidencia;

import java.util.UUID;

public interface IncidenciaRepository extends JpaRepository<Incidencia, UUID> {
}