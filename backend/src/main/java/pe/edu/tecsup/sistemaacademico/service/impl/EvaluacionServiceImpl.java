package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.request.EvaluacionRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.EvaluacionResponse;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Curso;
import pe.edu.tecsup.sistemaacademico.model.Evaluacion;
import pe.edu.tecsup.sistemaacademico.repository.CursoRepository;
import pe.edu.tecsup.sistemaacademico.repository.EvaluacionRepository;
import pe.edu.tecsup.sistemaacademico.service.EvaluacionService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvaluacionServiceImpl implements EvaluacionService {

    private final EvaluacionRepository evaluacionRepository;
    private final CursoRepository cursoRepository;

    @Override
    public EvaluacionResponse crear(EvaluacionRequest request) {
        Curso curso = cursoRepository.findById(request.getIdCurso())
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado: " + request.getIdCurso()));

        Evaluacion evaluacion = Evaluacion.builder()
                .curso(curso)
                .nombre(request.getNombre())
                .tipo(request.getTipo())
                .peso(request.getPeso())
                .fechaProgramada(request.getFechaProgramada())
                .build();

        evaluacion = evaluacionRepository.save(evaluacion);
        return toResponse(evaluacion);
    }

    @Override
    public List<EvaluacionResponse> listarPorCurso(UUID idCurso) {
        return evaluacionRepository.findByCurso_IdCurso(idCurso)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private EvaluacionResponse toResponse(Evaluacion e) {
        return EvaluacionResponse.builder()
                .idEvaluacion(e.getIdEvaluacion())
                .nombre(e.getNombre())
                .tipo(e.getTipo())
                .peso(e.getPeso())
                .fechaProgramada(e.getFechaProgramada())
                .idCurso(e.getCurso().getIdCurso())
                .nombreCurso(e.getCurso().getNombre())
                .build();
    }
}