package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.response.AuditoriaResponse;
import pe.edu.tecsup.sistemaacademico.model.Auditoria;
import pe.edu.tecsup.sistemaacademico.repository.AuditoriaRepository;
import pe.edu.tecsup.sistemaacademico.service.AuditoriaService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditoriaServiceImpl implements AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;

    @Override
    public void registrar(String accion, String entidad, String detalle, String username) {
        Auditoria auditoria = Auditoria.builder()
                .accion(accion)
                .entidad(entidad)
                .detalle(detalle)
                .username(username)
                .fecha(LocalDateTime.now())
                .build();
        auditoriaRepository.save(auditoria);
    }

    @Override
    public List<AuditoriaResponse> listarTodas() {
        return auditoriaRepository.findAllByOrderByFechaDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private AuditoriaResponse toResponse(Auditoria a) {
        return AuditoriaResponse.builder()
                .idAuditoria(a.getIdAuditoria())
                .accion(a.getAccion())
                .entidad(a.getEntidad())
                .detalle(a.getDetalle())
                .username(a.getUsername())
                .fecha(a.getFecha())
                .build();
    }
}