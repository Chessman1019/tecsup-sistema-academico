package pe.edu.tecsup.sistemaacademico.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "aula")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Aula {

    @Id
    @GeneratedValue
    @Column(name = "id_aula")
    private UUID idAula;

    @Column(name = "codigo", nullable = false, unique = true, length = 10)
    private String codigo;

    @Column(name = "edificio", nullable = false, length = 50)
    private String edificio;

    @Column(name = "capacidad", nullable = false)
    private Integer capacidad;

    @Column(name = "tipo", length = 30)
    private String tipo;
}