package pe.edu.tecsup.sistemaacademico.model;

import jakarta.persistence.*;
import lombok.*;
import pe.edu.tecsup.sistemaacademico.model.enums.EstadoAsistencia;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "reg_asistencia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroAsistencia {

    @Id
    @GeneratedValue
    @Column(name = "id_registro")
    private UUID idRegistro;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 1)
    private EstadoAsistencia estado;

    @Column(name = "observacion", columnDefinition = "TEXT")
    private String observacion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_matricula", nullable = false)
    private Matricula matricula;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_sesion", nullable = false)
    private Sesion sesion;
}