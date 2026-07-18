package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Matricula;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MatriculaRepository extends JpaRepository<Matricula, UUID> {

    List<Matricula> findByEstudiante_IdEstudiante(UUID idEstudiante);

    List<Matricula> findByCurso_IdCurso(UUID idCurso);

    List<Matricula> findByHorario_IdHorario(UUID idHorario);

    Optional<Matricula> findByEstudiante_IdEstudianteAndCurso_IdCursoAndCicloAcademico(
            UUID idEstudiante, UUID idCurso, String cicloAcademico);

    boolean existsByEstudiante_IdEstudianteAndCurso_IdCursoAndCicloAcademico(
            UUID idEstudiante, UUID idCurso, String cicloAcademico);
}