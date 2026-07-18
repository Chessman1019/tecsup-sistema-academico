package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Auditoria;

import java.util.List;
import java.util.UUID;

public interface AuditoriaRepository extends JpaRepository<Auditoria, UUID> {

    List<Auditoria> findAllByOrderByFechaDesc();
}