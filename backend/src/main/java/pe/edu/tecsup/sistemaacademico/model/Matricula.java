package pe.edu.tecsup.sistemaacademico.model;

import jakarta.persistence.*;
import lombok.*;
import pe.edu.tecsup.sistemaacademico.model.enums.EstadoMatricula;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "matricula")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Matricula {

    @Id
    @GeneratedValue
    @Column(name = "id_matricula")
    private UUID idMatricula;

    @Column(name = "ciclo_academico", nullable = false, length = 7)
    private String cicloAcademico;

    @Column(name = "fecha_matricula", nullable = false)
    private LocalDate fechaMatricula;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 20)
    private EstadoMatricula estado;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_estudiante", nullable = false)
    private Estudiante estudiante;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_curso", nullable = false)
    private Curso curso;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_horario", nullable = false)
    private Horario horario;
}