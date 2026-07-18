package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Programa;

import java.util.UUID;

public interface ProgramaRepository extends JpaRepository<Programa, UUID> {
}