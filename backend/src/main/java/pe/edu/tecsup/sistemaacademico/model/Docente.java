package pe.edu.tecsup.sistemaacademico.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "docente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Docente {

    @Id
    @GeneratedValue
    @Column(name = "id_docente")
    private UUID idDocente;

    @Column(name = "codigo_docente", nullable = false, unique = true, length = 10)
    private String codigoDocente;

    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;

    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;

    @Column(name = "correo", nullable = false, unique = true, length = 150)
    private String correo;

    @Column(name = "especialidad", length = 100)
    private String especialidad;

    @Column(name = "categoria", length = 50)
    private String categoria;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;
}