package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.response.PagoResponse;
import pe.edu.tecsup.sistemaacademico.model.Pago;
import pe.edu.tecsup.sistemaacademico.repository.PagoRepository;
import pe.edu.tecsup.sistemaacademico.service.PagoService;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PagoServiceImpl implements PagoService {

    private final PagoRepository pagoRepository;

    @Override
    public List<PagoResponse> listarTodos() {
        return pagoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PagoResponse> listarPorEstudiante(UUID idEstudiante) {
        return pagoRepository.findByEstudiante_IdEstudianteOrderByFechaEmisionDesc(idEstudiante)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private PagoResponse toResponse(Pago p) {
        String estado = p.getEstado().name();
        if ("Pendiente".equals(estado) && p.getFechaVencimiento().isBefore(LocalDate.now())) {
            estado = "Vencido";
        }

        return PagoResponse.builder()
                .idPago(p.getIdPago())
                .concepto(p.getConcepto())
                .monto(p.getMonto())
                .fechaEmision(p.getFechaEmision())
                .fechaVencimiento(p.getFechaVencimiento())
                .fechaPago(p.getFechaPago())
                .estado(estado)
                .metodoPago(p.getMetodoPago())
                .codigoAlumno(p.getEstudiante().getCodigoAlumno())
                .nombreEstudiante(p.getEstudiante().getNombres() + " " + p.getEstudiante().getApellidos())
                .build();
    }
}