package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.request.CursoRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.CursoResponse;
import pe.edu.tecsup.sistemaacademico.exception.BusinessException;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Curso;
import pe.edu.tecsup.sistemaacademico.repository.CursoRepository;
import pe.edu.tecsup.sistemaacademico.service.CursoService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CursoServiceImpl implements CursoService {

    private final CursoRepository cursoRepository;

    @Override
    public List<CursoResponse> listarTodos() {
        return cursoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CursoResponse> listarActivos() {
        return cursoRepository.findAll()
                .stream()
                .filter(c -> Boolean.TRUE.equals(c.getEstado()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CursoResponse crear(CursoRequest request) {
        if (cursoRepository.existsByCodigoCurso(request.getCodigoCurso())) {
            throw new BusinessException("Ya existe un curso con el codigo: " + request.getCodigoCurso());
        }

        Curso curso = Curso.builder()
                .codigoCurso(request.getCodigoCurso())
                .nombre(request.getNombre())
                .creditos(request.getCreditos())
                .horasSemanales(request.getHorasSemanales())
                .estado(request.getEstado() != null ? request.getEstado() : true)
                .build();

        curso = cursoRepository.save(curso);
        return toResponse(curso);
    }

    @Override
    public CursoResponse actualizar(UUID idCurso, CursoRequest request) {
        Curso curso = cursoRepository.findById(idCurso)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado: " + idCurso));

        if (!curso.getCodigoCurso().equalsIgnoreCase(request.getCodigoCurso())
                && cursoRepository.existsByCodigoCurso(request.getCodigoCurso())) {
            throw new BusinessException("Ya existe un curso con el codigo: " + request.getCodigoCurso());
        }

        curso.setCodigoCurso(request.getCodigoCurso());
        curso.setNombre(request.getNombre());
        curso.setCreditos(request.getCreditos());
        curso.setHorasSemanales(request.getHorasSemanales());
        if (request.getEstado() != null) {
            curso.setEstado(request.getEstado());
        }

        curso = cursoRepository.save(curso);
        return toResponse(curso);
    }

    @Override
    public void cambiarEstado(UUID idCurso, boolean estado) {
        Curso curso = cursoRepository.findById(idCurso)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado: " + idCurso));
        curso.setEstado(estado);
        cursoRepository.save(curso);
    }

    private CursoResponse toResponse(Curso c) {
        return CursoResponse.builder()
                .idCurso(c.getIdCurso())
                .codigoCurso(c.getCodigoCurso())
                .nombre(c.getNombre())
                .creditos(c.getCreditos())
                .horasSemanales(c.getHorasSemanales())
                .estado(c.getEstado())
                .build();
    }
}