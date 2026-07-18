package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.tecsup.sistemaacademico.dto.request.HorarioRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.HorarioResponse;
import pe.edu.tecsup.sistemaacademico.exception.BusinessException;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Aula;
import pe.edu.tecsup.sistemaacademico.model.Curso;
import pe.edu.tecsup.sistemaacademico.model.Docente;
import pe.edu.tecsup.sistemaacademico.model.Horario;
import pe.edu.tecsup.sistemaacademico.repository.AulaRepository;
import pe.edu.tecsup.sistemaacademico.repository.CursoRepository;
import pe.edu.tecsup.sistemaacademico.repository.DocenteRepository;
import pe.edu.tecsup.sistemaacademico.repository.HorarioRepository;
import pe.edu.tecsup.sistemaacademico.service.HorarioService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HorarioServiceImpl implements HorarioService {

        private final HorarioRepository horarioRepository;
        private final CursoRepository cursoRepository;
        private final DocenteRepository docenteRepository;
        private final AulaRepository aulaRepository;

        @Override
        @Transactional
        public HorarioResponse crearHorario(HorarioRequest request) {

                Curso curso = cursoRepository.findById(request.getIdCurso())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Curso no encontrado: " + request.getIdCurso()));

                Docente docente = docenteRepository.findById(request.getIdDocente())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Docente no encontrado: " + request.getIdDocente()));

                Aula aula = aulaRepository.findById(request.getIdAula())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Aula no encontrada: " + request.getIdAula()));

                if (!request.getHoraFin().isAfter(request.getHoraInicio())) {
                        throw new BusinessException("La hora de fin debe ser posterior a la hora de inicio.");
                }

                // FA-1: Detectar conflicto de horario del DOCENTE (mismo dia, cruce de horas)
                List<Horario> horariosDocente = horarioRepository
                                .findByDocente_IdDocenteAndDiaSemana(docente.getIdDocente(), request.getDiaSemana());

                boolean conflictoDocente = horariosDocente.stream()
                                .anyMatch(h -> seSuperponen(h.getHoraInicio(), h.getHoraFin(),
                                                request.getHoraInicio(), request.getHoraFin()));

                if (conflictoDocente) {
                        throw new BusinessException(
                                        "Conflicto de horario: el docente " + docente.getNombres() + " " +
                                                        docente.getApellidos() + " ya tiene una clase asignada en ese "
                                                        +
                                                        "dia y franja horaria.");
                }

                // FA-1: Detectar conflicto de horario del AULA (mismo dia, cruce de horas)
                List<Horario> horariosAula = horarioRepository
                                .findByAula_IdAulaAndDiaSemana(aula.getIdAula(), request.getDiaSemana());

                boolean conflictoAula = horariosAula.stream()
                                .anyMatch(h -> seSuperponen(h.getHoraInicio(), h.getHoraFin(),
                                                request.getHoraInicio(), request.getHoraFin()));

                if (conflictoAula) {
                        throw new BusinessException(
                                        "Conflicto de horario: el aula " + aula.getCodigo() +
                                                        " ya se encuentra ocupada en ese dia y franja horaria. " +
                                                        "Se sugiere elegir otra aula o franja disponible.");
                }

                Horario horario = Horario.builder()
                                .curso(curso)
                                .docente(docente)
                                .aula(aula)
                                .diaSemana(request.getDiaSemana())
                                .horaInicio(request.getHoraInicio())
                                .horaFin(request.getHoraFin())
                                .ciclo(request.getCiclo())
                                .build();

                horario = horarioRepository.save(horario);
                return toResponse(horario);
        }

        /**
         * Determina si dos rangos horarios [inicio1, fin1) y [inicio2, fin2) se
         * superponen.
         */
        private boolean seSuperponen(java.time.LocalTime inicio1, java.time.LocalTime fin1,
                        java.time.LocalTime inicio2, java.time.LocalTime fin2) {
                return inicio1.isBefore(fin2) && inicio2.isBefore(fin1);
        }

        @Override
        public List<HorarioResponse> listarTodos() {
                return horarioRepository.findAll()
                                .stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<HorarioResponse> listarPorCurso(UUID idCurso) {
                return horarioRepository.findByCurso_IdCurso(idCurso)
                                .stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<HorarioResponse> listarPorDocente(UUID idDocente) {
                return horarioRepository.findByDocente_IdDocente(idDocente)
                                .stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());
        }

        private HorarioResponse toResponse(Horario h) {
                return HorarioResponse.builder()
                                .idHorario(h.getIdHorario())
                                .idCurso(h.getCurso().getIdCurso())
                                .nombreCurso(h.getCurso().getNombre())
                                .nombreDocente(h.getDocente().getNombres() + " " + h.getDocente().getApellidos())
                                .codigoAula(h.getAula().getCodigo())
                                .diaSemana(h.getDiaSemana())
                                .horaInicio(h.getHoraInicio())
                                .horaFin(h.getHoraFin())
                                .ciclo(h.getCiclo())
                                .build();
        }
}