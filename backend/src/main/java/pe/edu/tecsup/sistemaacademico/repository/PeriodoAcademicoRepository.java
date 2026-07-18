package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.PeriodoAcademico;

import java.util.UUID;

public interface PeriodoAcademicoRepository extends JpaRepository<PeriodoAcademico, UUID> {

    boolean existsByCodigo(String codigo);
}