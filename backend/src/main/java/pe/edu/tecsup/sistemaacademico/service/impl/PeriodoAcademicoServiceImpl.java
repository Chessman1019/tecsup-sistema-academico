package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.request.PeriodoAcademicoRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.PeriodoAcademicoResponse;
import pe.edu.tecsup.sistemaacademico.exception.BusinessException;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.PeriodoAcademico;
import pe.edu.tecsup.sistemaacademico.repository.PeriodoAcademicoRepository;
import pe.edu.tecsup.sistemaacademico.service.PeriodoAcademicoService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PeriodoAcademicoServiceImpl implements PeriodoAcademicoService {

    private final PeriodoAcademicoRepository periodoAcademicoRepository;

    @Override
    public List<PeriodoAcademicoResponse> listarTodos() {
        return periodoAcademicoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PeriodoAcademicoResponse crear(PeriodoAcademicoRequest request) {
        if (periodoAcademicoRepository.existsByCodigo(request.getCodigo())) {
            throw new BusinessException("Ya existe un periodo con el codigo: " + request.getCodigo());
        }

        if (!request.getFechaFin().isAfter(request.getFechaInicio())) {
            throw new BusinessException("La fecha de fin debe ser posterior a la fecha de inicio.");
        }

        PeriodoAcademico periodo = PeriodoAcademico.builder()
                .codigo(request.getCodigo())
                .fechaInicio(request.getFechaInicio())
                .fechaFin(request.getFechaFin())
                .estado(request.getEstado() != null ? request.getEstado() : "Planificado")
                .build();

        periodo = periodoAcademicoRepository.save(periodo);
        return toResponse(periodo);
    }

    @Override
    public PeriodoAcademicoResponse actualizar(UUID idPeriodo, PeriodoAcademicoRequest request) {
        PeriodoAcademico periodo = periodoAcademicoRepository.findById(idPeriodo)
                .orElseThrow(() -> new ResourceNotFoundException("Periodo no encontrado: " + idPeriodo));

        if (!request.getFechaFin().isAfter(request.getFechaInicio())) {
            throw new BusinessException("La fecha de fin debe ser posterior a la fecha de inicio.");
        }

        periodo.setCodigo(request.getCodigo());
        periodo.setFechaInicio(request.getFechaInicio());
        periodo.setFechaFin(request.getFechaFin());
        if (request.getEstado() != null) {
            periodo.setEstado(request.getEstado());
        }

        periodo = periodoAcademicoRepository.save(periodo);
        return toResponse(periodo);
    }

    private PeriodoAcademicoResponse toResponse(PeriodoAcademico p) {
        return PeriodoAcademicoResponse.builder()
                .idPeriodo(p.getIdPeriodo())
                .codigo(p.getCodigo())
                .fechaInicio(p.getFechaInicio())
                .fechaFin(p.getFechaFin())
                .estado(p.getEstado())
                .build();
    }
}