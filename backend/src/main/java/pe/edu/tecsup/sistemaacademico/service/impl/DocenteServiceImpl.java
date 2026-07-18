package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.response.DocenteResponse;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Docente;
import pe.edu.tecsup.sistemaacademico.repository.DocenteRepository;
import pe.edu.tecsup.sistemaacademico.service.DocenteService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocenteServiceImpl implements DocenteService {

    private final DocenteRepository docenteRepository;

    @Override
    public DocenteResponse obtenerPerfilPorUsername(String username) {
        Docente docente = docenteRepository.findByUsuario_Username(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontro un docente asociado al usuario: " + username));
        return toResponse(docente);
    }

    @Override
    public List<DocenteResponse> listarTodos() {
        return docenteRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private DocenteResponse toResponse(Docente docente) {
        return DocenteResponse.builder()
                .idDocente(docente.getIdDocente())
                .codigoDocente(docente.getCodigoDocente())
                .nombres(docente.getNombres())
                .apellidos(docente.getApellidos())
                .correo(docente.getCorreo())
                .especialidad(docente.getEspecialidad())
                .categoria(docente.getCategoria())
                .build();
    }
}