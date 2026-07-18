package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.response.EstudianteResponse;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Estudiante;
import pe.edu.tecsup.sistemaacademico.repository.EstudianteRepository;
import pe.edu.tecsup.sistemaacademico.service.EstudianteService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EstudianteServiceImpl implements EstudianteService {

    private final EstudianteRepository estudianteRepository;

    @Override
    public EstudianteResponse obtenerPerfilPorUsername(String username) {
        Estudiante estudiante = estudianteRepository.findByUsuario_Username(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontro un estudiante asociado al usuario: " + username));

        return toResponse(estudiante);
    }

    @Override
    public List<EstudianteResponse> listarTodos() {
        return estudianteRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private EstudianteResponse toResponse(Estudiante estudiante) {
        return EstudianteResponse.builder()
                .idEstudiante(estudiante.getIdEstudiante())
                .codigoAlumno(estudiante.getCodigoAlumno())
                .nombres(estudiante.getNombres())
                .apellidos(estudiante.getApellidos())
                .correo(estudiante.getCorreo())
                .cicloActual(estudiante.getCicloActual())
                .estado(estudiante.getEstado())
                .build();
    }
}