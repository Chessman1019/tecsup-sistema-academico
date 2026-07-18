package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.tecsup.sistemaacademico.dto.request.CalificacionRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.CalificacionResponse;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Calificacion;
import pe.edu.tecsup.sistemaacademico.model.Evaluacion;
import pe.edu.tecsup.sistemaacademico.model.Matricula;
import pe.edu.tecsup.sistemaacademico.repository.CalificacionRepository;
import pe.edu.tecsup.sistemaacademico.repository.EvaluacionRepository;
import pe.edu.tecsup.sistemaacademico.repository.MatriculaRepository;
import pe.edu.tecsup.sistemaacademico.service.CalificacionService;
import pe.edu.tecsup.sistemaacademico.service.NotificacionService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalificacionServiceImpl implements CalificacionService {

    private final CalificacionRepository calificacionRepository;
    private final MatriculaRepository matriculaRepository;
    private final EvaluacionRepository evaluacionRepository;
    private final NotificacionService notificacionService;

    @Override
    @Transactional
    public CalificacionResponse registrarNota(CalificacionRequest request) {

        Matricula matricula = matriculaRepository.findById(request.getIdMatricula())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Matricula no encontrada: " + request.getIdMatricula()));

        Evaluacion evaluacion = evaluacionRepository.findById(request.getIdEvaluacion())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Evaluacion no encontrada: " + request.getIdEvaluacion()));

        // Buscar si ya existe una nota para esa matricula/evaluacion (permitir actualizar)
        Optional<Calificacion> existente = calificacionRepository
                .findByMatricula_IdMatriculaAndEvaluacion_IdEvaluacion(
                        matricula.getIdMatricula(), evaluacion.getIdEvaluacion());

        Calificacion calificacion = existente.orElseGet(() -> Calificacion.builder()
                .matricula(matricula)
                .evaluacion(evaluacion)
                .build());

        calificacion.setNota(request.getNota());
        calificacion.setFechaRegistro(LocalDateTime.now());

        calificacion = calificacionRepository.save(calificacion);

        // <<extend>> CUS08: notificar publicacion de notas
        notificacionService.notificar(
                matricula.getEstudiante().getUsuario().getIdUsuario(),
                "Nota publicada",
                "Se registro tu nota de '" + evaluacion.getNombre() + "' en el curso "
                        + matricula.getCurso().getNombre() + ": " + request.getNota()
        );

        return toResponse(calificacion);
    }

    @Override
    public List<CalificacionResponse> listarPorMatricula(UUID idMatricula) {
        return calificacionRepository.findByMatricula_IdMatricula(idMatricula)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BigDecimal calcularPromedioPonderado(UUID idMatricula) {
        List<Calificacion> calificaciones = calificacionRepository
                .findByMatricula_IdMatricula(idMatricula);

        if (calificaciones.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal sumaPonderada = BigDecimal.ZERO;
        BigDecimal sumaPesos = BigDecimal.ZERO;

        for (Calificacion c : calificaciones) {
            BigDecimal peso = c.getEvaluacion().getPeso(); // ej. 20.00 (%)
            sumaPonderada = sumaPonderada.add(c.getNota().multiply(peso));
            sumaPesos = sumaPesos.add(peso);
        }

        if (sumaPesos.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        return sumaPonderada.divide(sumaPesos, 2, RoundingMode.HALF_UP);
    }

    private CalificacionResponse toResponse(Calificacion c) {
        return CalificacionResponse.builder()
                .idCalificacion(c.getIdCalificacion())
                .nombreEstudiante(
                        c.getMatricula().getEstudiante().getNombres() + " " +
                        c.getMatricula().getEstudiante().getApellidos())
                .nombreEvaluacion(c.getEvaluacion().getNombre())
                .nota(c.getNota())
                .fechaRegistro(c.getFechaRegistro())
                .build();
    }
}