package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.request.SedeRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.SedeResponse;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Sede;
import pe.edu.tecsup.sistemaacademico.repository.SedeRepository;
import pe.edu.tecsup.sistemaacademico.service.SedeService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SedeServiceImpl implements SedeService {

    private final SedeRepository sedeRepository;

    @Override
    public List<SedeResponse> listarTodas() {
        return sedeRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SedeResponse crear(SedeRequest request) {
        Sede sede = Sede.builder()
                .nombre(request.getNombre())
                .direccion(request.getDireccion())
                .ciudad(request.getCiudad())
                .estado(request.getEstado() != null ? request.getEstado() : true)
                .build();

        sede = sedeRepository.save(sede);
        return toResponse(sede);
    }

    @Override
    public SedeResponse actualizar(UUID idSede, SedeRequest request) {
        Sede sede = sedeRepository.findById(idSede)
                .orElseThrow(() -> new ResourceNotFoundException("Sede no encontrada: " + idSede));

        sede.setNombre(request.getNombre());
        sede.setDireccion(request.getDireccion());
        sede.setCiudad(request.getCiudad());
        if (request.getEstado() != null) {
            sede.setEstado(request.getEstado());
        }

        sede = sedeRepository.save(sede);
        return toResponse(sede);
    }

    @Override
    public void cambiarEstado(UUID idSede, boolean estado) {
        Sede sede = sedeRepository.findById(idSede)
                .orElseThrow(() -> new ResourceNotFoundException("Sede no encontrada: " + idSede));
        sede.setEstado(estado);
        sedeRepository.save(sede);
    }

    private SedeResponse toResponse(Sede s) {
        return SedeResponse.builder()
                .idSede(s.getIdSede())
                .nombre(s.getNombre())
                .direccion(s.getDireccion())
                .ciudad(s.getCiudad())
                .estado(s.getEstado())
                .build();
    }
}