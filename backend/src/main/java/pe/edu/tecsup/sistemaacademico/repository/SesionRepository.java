package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Sesion;

import java.util.List;
import java.util.UUID;

public interface SesionRepository extends JpaRepository<Sesion, UUID> {

    List<Sesion> findByHorario_IdHorario(UUID idHorario);
}