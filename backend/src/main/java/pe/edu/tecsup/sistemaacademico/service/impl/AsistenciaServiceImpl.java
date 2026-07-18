package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.tecsup.sistemaacademico.dto.request.AsistenciaRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.AsistenciaResponse;
import pe.edu.tecsup.sistemaacademico.dto.response.PorcentajeAsistenciaResponse;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Matricula;
import pe.edu.tecsup.sistemaacademico.model.RegistroAsistencia;
import pe.edu.tecsup.sistemaacademico.model.Sesion;
import pe.edu.tecsup.sistemaacademico.model.enums.EstadoAsistencia;
import pe.edu.tecsup.sistemaacademico.repository.MatriculaRepository;
import pe.edu.tecsup.sistemaacademico.repository.RegistroAsistenciaRepository;
import pe.edu.tecsup.sistemaacademico.repository.SesionRepository;
import pe.edu.tecsup.sistemaacademico.service.AsistenciaService;
import pe.edu.tecsup.sistemaacademico.service.NotificacionService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AsistenciaServiceImpl implements AsistenciaService {

    private static final double UMBRAL_RIESGO = 70.0;

    private final RegistroAsistenciaRepository asistenciaRepository;
    private final MatriculaRepository matriculaRepository;
    private final SesionRepository sesionRepository;
    private final NotificacionService notificacionService;

    @Override
    @Transactional
    public AsistenciaResponse registrarAsistencia(AsistenciaRequest request) {

        Matricula matricula = matriculaRepository.findById(request.getIdMatricula())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Matricula no encontrada: " + request.getIdMatricula()));

        Sesion sesion = sesionRepository.findById(request.getIdSesion())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sesion no encontrada: " + request.getIdSesion()));

        // Permitir actualizar si ya existe un registro para esa matricula/sesion
        Optional<RegistroAsistencia> existente = asistenciaRepository
                .findByMatricula_IdMatriculaAndSesion_IdSesion(
                        matricula.getIdMatricula(), sesion.getIdSesion());

        RegistroAsistencia registro = existente.orElseGet(() -> RegistroAsistencia.builder()
                .matricula(matricula)
                .sesion(sesion)
                .build());

        registro.setEstado(request.getEstado());
        registro.setFecha(sesion.getFechaSesion());
        registro.setObservacion(request.getObservacion());

        registro = asistenciaRepository.save(registro);

        // FA-2: Si el porcentaje acumulado cae por debajo del umbral critico, alertar
        PorcentajeAsistenciaResponse porcentaje = calcularPorcentaje(matricula.getIdMatricula());
        if (porcentaje.isEnRiesgo()) {
            notificacionService.notificar(
                    matricula.getEstudiante().getUsuario().getIdUsuario(),
                    "Alerta de asistencia",
                    "Tu porcentaje de asistencia en " + matricula.getCurso().getNombre() +
                            " es de " + String.format("%.1f", porcentaje.getPorcentajeAsistencia()) +
                            "%, por debajo del minimo requerido (70%)."
            );
        }

        return toResponse(registro);
    }

    @Override
    public List<AsistenciaResponse> listarPorMatricula(UUID idMatricula) {
        return asistenciaRepository.findByMatricula_IdMatricula(idMatricula)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AsistenciaResponse> listarPorSesion(UUID idSesion) {
        return asistenciaRepository.findBySesion_IdSesion(idSesion)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PorcentajeAsistenciaResponse calcularPorcentaje(UUID idMatricula) {
        List<RegistroAsistencia> registros = asistenciaRepository
                .findByMatricula_IdMatricula(idMatricula);

        long total = registros.size();
        long presentes = registros.stream()
                .filter(r -> r.getEstado() == EstadoAsistencia.P).count();
        long tardanzas = registros.stream()
                .filter(r -> r.getEstado() == EstadoAsistencia.T).count();
        long ausencias = registros.stream()
                .filter(r -> r.getEstado() == EstadoAsistencia.A).count();

        double porcentaje = total == 0 ? 100.0 :
                ((presentes + tardanzas) * 100.0) / total;

        return PorcentajeAsistenciaResponse.builder()
                .idMatricula(idMatricula)
                .totalSesiones(total)
                .presentes(presentes)
                .tardanzas(tardanzas)
                .ausencias(ausencias)
                .porcentajeAsistencia(porcentaje)
                .enRiesgo(porcentaje < UMBRAL_RIESGO)
                .build();
    }

    private AsistenciaResponse toResponse(RegistroAsistencia r) {
        return AsistenciaResponse.builder()
                .idRegistro(r.getIdRegistro())
                .nombreEstudiante(
                        r.getMatricula().getEstudiante().getNombres() + " " +
                        r.getMatricula().getEstudiante().getApellidos())
                .fecha(r.getFecha())
                .estado(r.getEstado().name())
                .observacion(r.getObservacion())
                .build();
    }
}