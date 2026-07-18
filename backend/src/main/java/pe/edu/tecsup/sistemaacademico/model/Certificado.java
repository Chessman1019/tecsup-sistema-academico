package pe.edu.tecsup.sistemaacademico.model;

import jakarta.persistence.*;
import lombok.*;
import pe.edu.tecsup.sistemaacademico.model.enums.EstadoCertificado;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "certificado")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificado {

    @Id
    @GeneratedValue
    @Column(name = "id_certificado")
    private UUID idCertificado;

    @Column(name = "tipo", nullable = false, length = 50)
    private String tipo;

    @Column(name = "fecha_solicitud", nullable = false)
    private LocalDate fechaSolicitud;

    @Column(name = "fecha_emision")
    private LocalDate fechaEmision;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 20)
    private EstadoCertificado estado;

    @Column(name = "url_doc", length = 300)
    private String urlDoc;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_estudiante", nullable = false)
    private Estudiante estudiante;
}