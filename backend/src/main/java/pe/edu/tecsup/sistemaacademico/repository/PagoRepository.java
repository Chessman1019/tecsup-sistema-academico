package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Pago;

import java.util.List;
import java.util.UUID;

public interface PagoRepository extends JpaRepository<Pago, UUID> {

    List<Pago> findByEstudiante_IdEstudianteOrderByFechaEmisionDesc(UUID idEstudiante);
}