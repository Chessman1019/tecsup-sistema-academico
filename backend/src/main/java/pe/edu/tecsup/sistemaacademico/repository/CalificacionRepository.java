package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Calificacion;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CalificacionRepository extends JpaRepository<Calificacion, UUID> {

    List<Calificacion> findByMatricula_IdMatricula(UUID idMatricula);

    Optional<Calificacion> findByMatricula_IdMatriculaAndEvaluacion_IdEvaluacion(
            UUID idMatricula, UUID idEvaluacion);
}