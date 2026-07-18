package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Certificado;

import java.util.List;
import java.util.UUID;

public interface CertificadoRepository extends JpaRepository<Certificado, UUID> {

    List<Certificado> findByEstudiante_IdEstudiante(UUID idEstudiante);
}