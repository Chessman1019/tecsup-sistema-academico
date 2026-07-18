package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.request.IncidenciaRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.IncidenciaResponse;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Curso;
import pe.edu.tecsup.sistemaacademico.model.Docente;
import pe.edu.tecsup.sistemaacademico.model.Incidencia;
import pe.edu.tecsup.sistemaacademico.repository.CursoRepository;
import pe.edu.tecsup.sistemaacademico.repository.DocenteRepository;
import pe.edu.tecsup.sistemaacademico.repository.IncidenciaRepository;
import pe.edu.tecsup.sistemaacademico.service.IncidenciaService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidenciaServiceImpl implements IncidenciaService {

    private final IncidenciaRepository incidenciaRepository;
    private final DocenteRepository docenteRepository;
    private final CursoRepository cursoRepository;

    @Override
    public IncidenciaResponse crear(IncidenciaRequest request) {
        Docente docente = null;
        if (request.getIdDocente() != null) {
            docente = docenteRepository.findById(request.getIdDocente())
                    .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado: " + request.getIdDocente()));
        }

        Curso curso = null;
        if (request.getIdCurso() != null) {
            curso = cursoRepository.findById(request.getIdCurso())
                    .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado: " + request.getIdCurso()));
        }

        Incidencia incidencia = Incidencia.builder()
                .titulo(request.getTitulo())
                .descripcion(request.getDescripcion())
                .tipo(request.getTipo())
                .prioridad(request.getPrioridad() != null ? request.getPrioridad() : "Media")
                .estado("Abierta")
                .fechaCreacion(LocalDateTime.now())
                .docente(docente)
                .curso(curso)
                .build();

        incidencia = incidenciaRepository.save(incidencia);
        return toResponse(incidencia);
    }

    @Override
    public List<IncidenciaResponse> listarTodas() {
        return incidenciaRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public IncidenciaResponse cambiarEstado(UUID idIncidencia, String nuevoEstado) {
        Incidencia incidencia = incidenciaRepository.findById(idIncidencia)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada: " + idIncidencia));

        incidencia.setEstado(nuevoEstado);
        if ("Resuelta".equals(nuevoEstado)) {
            incidencia.setFechaResolucion(LocalDateTime.now());
        }

        incidencia = incidenciaRepository.save(incidencia);
        return toResponse(incidencia);
    }

    private IncidenciaResponse toResponse(Incidencia i) {
        return IncidenciaResponse.builder()
                .idIncidencia(i.getIdIncidencia())
                .titulo(i.getTitulo())
                .descripcion(i.getDescripcion())
                .tipo(i.getTipo())
                .prioridad(i.getPrioridad())
                .estado(i.getEstado())
                .fechaCreacion(i.getFechaCreacion())
                .fechaResolucion(i.getFechaResolucion())
                .nombreDocente(i.getDocente() != null ? i.getDocente().getNombres() + " " + i.getDocente().getApellidos() : null)
                .nombreCurso(i.getCurso() != null ? i.getCurso().getNombre() : null)
                .build();
    }
}