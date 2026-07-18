package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.request.MaterialRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.MaterialResponse;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Curso;
import pe.edu.tecsup.sistemaacademico.model.Docente;
import pe.edu.tecsup.sistemaacademico.model.Material;
import pe.edu.tecsup.sistemaacademico.repository.CursoRepository;
import pe.edu.tecsup.sistemaacademico.repository.DocenteRepository;
import pe.edu.tecsup.sistemaacademico.repository.MaterialRepository;
import pe.edu.tecsup.sistemaacademico.service.MaterialService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;
    private final CursoRepository cursoRepository;
    private final DocenteRepository docenteRepository;

    @Override
    public MaterialResponse crear(MaterialRequest request, String usernameDocente) {
        Curso curso = cursoRepository.findById(request.getIdCurso())
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado: " + request.getIdCurso()));

        Docente docente = docenteRepository.findByUsuario_Username(usernameDocente)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Docente no encontrado para el usuario: " + usernameDocente));

        Material material = Material.builder()
                .curso(curso)
                .docente(docente)
                .titulo(request.getTitulo())
                .descripcion(request.getDescripcion())
                .urlArchivo(request.getUrlArchivo())
                .tipo(request.getTipo())
                .fechaSubida(LocalDateTime.now())
                .build();

        material = materialRepository.save(material);
        return toResponse(material);
    }

    @Override
    public List<MaterialResponse> listarPorCurso(UUID idCurso) {
        return materialRepository.findByCurso_IdCursoOrderByFechaSubidaDesc(idCurso)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MaterialResponse> listarPorDocente(UUID idDocente) {
        return materialRepository.findByDocente_IdDocenteOrderByFechaSubidaDesc(idDocente)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void eliminar(UUID idMaterial) {
        if (!materialRepository.existsById(idMaterial)) {
            throw new ResourceNotFoundException("Material no encontrado: " + idMaterial);
        }
        materialRepository.deleteById(idMaterial);
    }

    private MaterialResponse toResponse(Material m) {
        return MaterialResponse.builder()
                .idMaterial(m.getIdMaterial())
                .titulo(m.getTitulo())
                .descripcion(m.getDescripcion())
                .urlArchivo(m.getUrlArchivo())
                .tipo(m.getTipo())
                .fechaSubida(m.getFechaSubida())
                .idCurso(m.getCurso().getIdCurso())
                .nombreCurso(m.getCurso().getNombre())
                .nombreDocente(m.getDocente().getNombres() + " " + m.getDocente().getApellidos())
                .build();
    }
}