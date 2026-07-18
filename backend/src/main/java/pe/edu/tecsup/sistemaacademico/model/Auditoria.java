package pe.edu.tecsup.sistemaacademico.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "auditoria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Auditoria {

    @Id
    @GeneratedValue
    @Column(name = "id_auditoria")
    private UUID idAuditoria;

    @Column(name = "accion", nullable = false, length = 100)
    private String accion;

    @Column(name = "entidad", nullable = false, length = 50)
    private String entidad;

    @Column(name = "detalle", columnDefinition = "TEXT")
    private String detalle;

    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;
}