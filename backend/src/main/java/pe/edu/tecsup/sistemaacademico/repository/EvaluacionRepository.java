package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Evaluacion;

import java.util.List;
import java.util.UUID;

public interface EvaluacionRepository extends JpaRepository<Evaluacion, UUID> {

    List<Evaluacion> findByCurso_IdCurso(UUID idCurso);
}