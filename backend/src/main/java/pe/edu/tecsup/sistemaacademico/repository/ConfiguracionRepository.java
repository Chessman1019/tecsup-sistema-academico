package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.tecsup.sistemaacademico.model.Configuracion;

import java.util.Optional;
import java.util.UUID;

public interface ConfiguracionRepository extends JpaRepository<Configuracion, UUID> {

    Optional<Configuracion> findByClave(String clave);
}