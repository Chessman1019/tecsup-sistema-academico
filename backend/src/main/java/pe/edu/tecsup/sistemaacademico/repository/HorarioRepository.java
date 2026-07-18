package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Horario;

import java.util.List;
import java.util.UUID;

public interface HorarioRepository extends JpaRepository<Horario, UUID> {

    List<Horario> findByCurso_IdCurso(UUID idCurso);

    List<Horario> findByDocente_IdDocente(UUID idDocente);

    // Para detectar conflictos: mismo docente, mismo dia, cruce de horas
    List<Horario> findByDocente_IdDocenteAndDiaSemana(UUID idDocente, Short diaSemana);

    // Para detectar conflictos: misma aula, mismo dia
    List<Horario> findByAula_IdAulaAndDiaSemana(UUID idAula, Short diaSemana);
}