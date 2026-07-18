package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.tecsup.sistemaacademico.dto.request.CertificadoRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.CertificadoResponse;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Certificado;
import pe.edu.tecsup.sistemaacademico.model.Estudiante;
import pe.edu.tecsup.sistemaacademico.model.enums.EstadoCertificado;
import pe.edu.tecsup.sistemaacademico.repository.CertificadoRepository;
import pe.edu.tecsup.sistemaacademico.repository.EstudianteRepository;
import pe.edu.tecsup.sistemaacademico.service.CertificadoService;
import pe.edu.tecsup.sistemaacademico.service.NotificacionService;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificadoServiceImpl implements CertificadoService {

        private final CertificadoRepository certificadoRepository;
        private final EstudianteRepository estudianteRepository;
        private final NotificacionService notificacionService;

        @Override
        @Transactional
        public CertificadoResponse solicitar(CertificadoRequest request) {

                Estudiante estudiante = estudianteRepository.findById(request.getIdEstudiante())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Estudiante no encontrado: " + request.getIdEstudiante()));

                Certificado certificado = Certificado.builder()
                                .estudiante(estudiante)
                                .tipo(request.getTipo())
                                .fechaSolicitud(LocalDate.now())
                                .estado(EstadoCertificado.Pendiente)
                                .build();

                certificado = certificadoRepository.save(certificado);
                return toResponse(certificado);
        }

        @Override
        @Transactional
        public CertificadoResponse emitir(UUID idCertificado, String urlDoc) {

                Certificado certificado = certificadoRepository.findById(idCertificado)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Certificado no encontrado: " + idCertificado));

                certificado.setEstado(EstadoCertificado.Emitido);
                certificado.setFechaEmision(LocalDate.now());
                certificado.setUrlDoc(urlDoc);

                certificado = certificadoRepository.save(certificado);

                notificacionService.notificar(
                                certificado.getEstudiante().getUsuario().getIdUsuario(),
                                "Certificado listo",
                                "Tu " + certificado.getTipo() + " ha sido emitido y esta disponible para descarga.");

                return toResponse(certificado);
        }

        @Override
        public List<CertificadoResponse> listarTodos() {
                return certificadoRepository.findAll()
                                .stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<CertificadoResponse> listarPorEstudiante(UUID idEstudiante) {
                return certificadoRepository.findByEstudiante_IdEstudiante(idEstudiante)
                                .stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());
        }

        private CertificadoResponse toResponse(Certificado c) {
                return CertificadoResponse.builder()
                                .idCertificado(c.getIdCertificado())
                                .nombreEstudiante(
                                                c.getEstudiante().getNombres() + " " + c.getEstudiante().getApellidos())
                                .tipo(c.getTipo())
                                .fechaSolicitud(c.getFechaSolicitud())
                                .fechaEmision(c.getFechaEmision())
                                .estado(c.getEstado().name())
                                .urlDoc(c.getUrlDoc())
                                .build();
        }
}