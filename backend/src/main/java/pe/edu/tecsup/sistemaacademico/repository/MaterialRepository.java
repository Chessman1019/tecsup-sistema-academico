package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Material;

import java.util.List;
import java.util.UUID;

public interface MaterialRepository extends JpaRepository<Material, UUID> {

    List<Material> findByCurso_IdCursoOrderByFechaSubidaDesc(UUID idCurso);

    List<Material> findByDocente_IdDocenteOrderByFechaSubidaDesc(UUID idDocente);
}