package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.RegistroAsistencia;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RegistroAsistenciaRepository extends JpaRepository<RegistroAsistencia, UUID> {

    List<RegistroAsistencia> findByMatricula_IdMatricula(UUID idMatricula);

    List<RegistroAsistencia> findBySesion_IdSesion(UUID idSesion);

    Optional<RegistroAsistencia> findByMatricula_IdMatriculaAndSesion_IdSesion(
            UUID idMatricula, UUID idSesion);
}