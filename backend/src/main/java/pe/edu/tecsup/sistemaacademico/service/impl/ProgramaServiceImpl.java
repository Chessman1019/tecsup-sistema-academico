package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.request.ProgramaRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.ProgramaResponse;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Carrera;
import pe.edu.tecsup.sistemaacademico.model.Programa;
import pe.edu.tecsup.sistemaacademico.repository.CarreraRepository;
import pe.edu.tecsup.sistemaacademico.repository.ProgramaRepository;
import pe.edu.tecsup.sistemaacademico.service.ProgramaService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgramaServiceImpl implements ProgramaService {

    private final ProgramaRepository programaRepository;
    private final CarreraRepository carreraRepository;

    @Override
    public List<ProgramaResponse> listarTodos() {
        return programaRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProgramaResponse crear(ProgramaRequest request) {
        Carrera carrera = null;
        if (request.getIdCarrera() != null) {
            carrera = carreraRepository.findById(request.getIdCarrera())
                    .orElseThrow(() -> new ResourceNotFoundException("Carrera no encontrada: " + request.getIdCarrera()));
        }

        Programa programa = Programa.builder()
                .nombre(request.getNombre())
                .tipo(request.getTipo())
                .estado(request.getEstado() != null ? request.getEstado() : true)
                .carrera(carrera)
                .build();

        programa = programaRepository.save(programa);
        return toResponse(programa);
    }

    @Override
    public ProgramaResponse actualizar(UUID idPrograma, ProgramaRequest request) {
        Programa programa = programaRepository.findById(idPrograma)
                .orElseThrow(() -> new ResourceNotFoundException("Programa no encontrado: " + idPrograma));

        Carrera carrera = null;
        if (request.getIdCarrera() != null) {
            carrera = carreraRepository.findById(request.getIdCarrera())
                    .orElseThrow(() -> new ResourceNotFoundException("Carrera no encontrada: " + request.getIdCarrera()));
        }

        programa.setNombre(request.getNombre());
        programa.setTipo(request.getTipo());
        programa.setCarrera(carrera);
        if (request.getEstado() != null) {
            programa.setEstado(request.getEstado());
        }

        programa = programaRepository.save(programa);
        return toResponse(programa);
    }

    @Override
    public void cambiarEstado(UUID idPrograma, boolean estado) {
        Programa programa = programaRepository.findById(idPrograma)
                .orElseThrow(() -> new ResourceNotFoundException("Programa no encontrado: " + idPrograma));
        programa.setEstado(estado);
        programaRepository.save(programa);
    }

    private ProgramaResponse toResponse(Programa p) {
        return ProgramaResponse.builder()
                .idPrograma(p.getIdPrograma())
                .nombre(p.getNombre())
                .tipo(p.getTipo())
                .estado(p.getEstado())
                .nombreCarrera(p.getCarrera() != null ? p.getCarrera().getNombre() : null)
                .build();
    }
}