package pe.edu.tecsup.sistemaacademico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pe.edu.tecsup.sistemaacademico.model.Notificacion;

import java.util.List;
import java.util.UUID;

public interface NotificacionRepository extends JpaRepository<Notificacion, UUID> {

    List<Notificacion> findByUsuario_IdUsuarioOrderByFechaEnvioDesc(UUID idUsuario);

    List<Notificacion> findByUsuario_IdUsuarioAndLeidaFalse(UUID idUsuario);

    @Query("SELECT n FROM Notificacion n WHERE n.usuario.username = :username ORDER BY n.fechaEnvio DESC")
    List<Notificacion> findByUsuarioUsernameOrderByFechaEnvioDesc(@Param("username") String username);
}