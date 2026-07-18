package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Documento;

import java.util.List;
import java.util.UUID;

public interface DocumentoRepository extends JpaRepository<Documento, UUID> {

    List<Documento> findByEstudiante_IdEstudianteOrderByFechaSubidaDesc(UUID idEstudiante);
}