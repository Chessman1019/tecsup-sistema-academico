package pe.edu.tecsup.sistemaacademico.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "curso")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Curso {

    @Id
    @GeneratedValue
    @Column(name = "id_curso")
    private UUID idCurso;

    @Column(name = "codigo_curso", nullable = false, unique = true, length = 10)
    private String codigoCurso;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Column(name = "creditos", nullable = false)
    private Integer creditos;

    @Column(name = "horas_semanales", nullable = false)
    private Integer horasSemanales;

    @Column(name = "estado", nullable = false)
    private Boolean estado;
}