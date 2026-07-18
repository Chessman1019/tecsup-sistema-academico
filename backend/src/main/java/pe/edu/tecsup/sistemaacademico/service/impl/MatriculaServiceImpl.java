package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.tecsup.sistemaacademico.dto.request.MatriculaRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.MatriculaResponse;
import pe.edu.tecsup.sistemaacademico.exception.BusinessException;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.*;
import pe.edu.tecsup.sistemaacademico.model.enums.EstadoMatricula;
import pe.edu.tecsup.sistemaacademico.repository.*;
import pe.edu.tecsup.sistemaacademico.service.MatriculaService;
import pe.edu.tecsup.sistemaacademico.service.NotificacionService;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatriculaServiceImpl implements MatriculaService {

        private static final String CLAVE_MAX_VACANTES = "MAX_VACANTES_POR_HORARIO";
        private static final int MAX_VACANTES_POR_DEFECTO = 30;

        private final MatriculaRepository matriculaRepository;
        private final EstudianteRepository estudianteRepository;
        private final CursoRepository cursoRepository;
        private final HorarioRepository horarioRepository;
        private final NotificacionService notificacionService;
        private final ConfiguracionRepository configuracionRepository;

        @Override
        @Transactional
        public MatriculaResponse matricular(MatriculaRequest request) {

                // 1. Obtener estudiante, curso y horario (o lanzar 404)
                Estudiante estudiante = estudianteRepository.findById(request.getIdEstudiante())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Estudiante no encontrado: " + request.getIdEstudiante()));

                Curso curso = cursoRepository.findById(request.getIdCurso())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Curso no encontrado: " + request.getIdCurso()));

                Horario horario = horarioRepository.findById(request.getIdHorario())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Horario no encontrado: " + request.getIdHorario()));

                // 2. FA-3: Validar que el curso este activo (periodo/curso disponible)
                if (!Boolean.TRUE.equals(curso.getEstado())) {
                        throw new BusinessException(
                                        "El curso '" + curso.getNombre()
                                                        + "' no esta disponible para matricula en este periodo.");
                }

                // 3. Regla: no matricularse dos veces en el mismo curso/ciclo
                boolean yaMatriculado = matriculaRepository
                                .existsByEstudiante_IdEstudianteAndCurso_IdCursoAndCicloAcademico(
                                                estudiante.getIdEstudiante(), curso.getIdCurso(),
                                                request.getCicloAcademico());
                if (yaMatriculado) {
                        throw new BusinessException(
                                        "El estudiante ya se encuentra matriculado en este curso para el ciclo "
                                                        + request.getCicloAcademico());
                }

                // 4. FA-1: Validar prerrequisitos
                validarPrerrequisitos(estudiante, curso);

                // 5. FA-2: Validar disponibilidad de vacantes en el horario
                //    (el maximo se administra desde el modulo de Configuracion)
                int maxVacantes = obtenerMaxVacantesPorHorario();

                long matriculadosEnHorario = matriculaRepository.findByCurso_IdCurso(curso.getIdCurso())
                                .stream()
                                .filter(m -> m.getHorario().getIdHorario().equals(horario.getIdHorario()))
                                .filter(m -> m.getEstado() == EstadoMatricula.Activo)
                                .count();

                if (matriculadosEnHorario >= maxVacantes) {
                        throw new BusinessException(
                                        "No hay vacantes disponibles en el horario seleccionado. " +
                                                        "El estudiante puede optar por la lista de espera.");
                }

                // 6. Registrar matricula
                Matricula matricula = Matricula.builder()
                                .estudiante(estudiante)
                                .curso(curso)
                                .horario(horario)
                                .cicloAcademico(request.getCicloAcademico())
                                .fechaMatricula(LocalDate.now())
                                .estado(EstadoMatricula.Activo)
                                .build();

                matricula = matriculaRepository.save(matricula);

                // 7. <<extend>> CUS08: enviar notificacion de confirmacion
                notificacionService.notificar(
                                estudiante.getUsuario().getIdUsuario(),
                                "Matricula confirmada",
                                "Tu matricula en el curso " + curso.getNombre() +
                                                " (ciclo " + request.getCicloAcademico()
                                                + ") fue registrada exitosamente.");

                return toResponse(matricula);
        }

        private int obtenerMaxVacantesPorHorario() {
                return configuracionRepository.findByClave(CLAVE_MAX_VACANTES)
                                .map(config -> {
                                        try {
                                                return Integer.parseInt(config.getValor().trim());
                                        } catch (NumberFormatException ex) {
                                                return MAX_VACANTES_POR_DEFECTO;
                                        }
                                })
                                .orElse(MAX_VACANTES_POR_DEFECTO);
        }

        private void validarPrerrequisitos(Estudiante estudiante, Curso curso) {
                if (!Boolean.TRUE.equals(estudiante.getEstado())) {
                        throw new BusinessException(
                                        "El estudiante no cumple las condiciones academicas/administrativas " +
                                                        "para matricularse (prerrequisito no satisfecho).");
                }
        }

        @Override
        public List<MatriculaResponse> listarTodas() {
                return matriculaRepository.findAll()
                                .stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<MatriculaResponse> listarPorEstudiante(UUID idEstudiante) {
                return matriculaRepository.findByEstudiante_IdEstudiante(idEstudiante)
                                .stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<MatriculaResponse> listarPorHorario(UUID idHorario) {
                return matriculaRepository.findByHorario_IdHorario(idHorario)
                                .stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        public MatriculaResponse retirarMatricula(UUID idMatricula) {
                Matricula matricula = matriculaRepository.findById(idMatricula)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Matricula no encontrada: " + idMatricula));

                matricula.setEstado(EstadoMatricula.Retirado);
                matricula = matriculaRepository.save(matricula);

                return toResponse(matricula);
        }

        private MatriculaResponse toResponse(Matricula m) {
                return MatriculaResponse.builder()
                                .idMatricula(m.getIdMatricula())
                                .codigoAlumno(m.getEstudiante().getCodigoAlumno())
                                .nombreCompletoEstudiante(
                                                m.getEstudiante().getNombres() + " " + m.getEstudiante().getApellidos())
                                .codigoCurso(m.getCurso().getCodigoCurso())
                                .nombreCurso(m.getCurso().getNombre())
                                .cicloAcademico(m.getCicloAcademico())
                                .fechaMatricula(m.getFechaMatricula())
                                .estado(m.getEstado().name())
                                .idHorario(m.getHorario().getIdHorario())
                                .nombreDocente(m.getHorario().getDocente().getNombres() + " "
                                                + m.getHorario().getDocente().getApellidos())
                                .codigoAula(m.getHorario().getAula().getCodigo())
                                .diaSemana(m.getHorario().getDiaSemana())
                                .horaInicio(m.getHorario().getHoraInicio())
                                .horaFin(m.getHorario().getHoraFin())
                                .build();
        }
}