package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.request.CarreraRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.CarreraResponse;
import pe.edu.tecsup.sistemaacademico.exception.BusinessException;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Carrera;
import pe.edu.tecsup.sistemaacademico.model.Sede;
import pe.edu.tecsup.sistemaacademico.repository.CarreraRepository;
import pe.edu.tecsup.sistemaacademico.repository.SedeRepository;
import pe.edu.tecsup.sistemaacademico.service.CarreraService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarreraServiceImpl implements CarreraService {

    private final CarreraRepository carreraRepository;
    private final SedeRepository sedeRepository;

    @Override
    public List<CarreraResponse> listarTodas() {
        return carreraRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CarreraResponse crear(CarreraRequest request) {
        if (carreraRepository.existsByCodigo(request.getCodigo())) {
            throw new BusinessException("Ya existe una carrera con el codigo: " + request.getCodigo());
        }

        Sede sede = null;
        if (request.getIdSede() != null) {
            sede = sedeRepository.findById(request.getIdSede())
                    .orElseThrow(() -> new ResourceNotFoundException("Sede no encontrada: " + request.getIdSede()));
        }

        Carrera carrera = Carrera.builder()
                .codigo(request.getCodigo())
                .nombre(request.getNombre())
                .duracionCiclos(request.getDuracionCiclos())
                .estado(request.getEstado() != null ? request.getEstado() : true)
                .sede(sede)
                .build();

        carrera = carreraRepository.save(carrera);
        return toResponse(carrera);
    }

    @Override
    public CarreraResponse actualizar(UUID idCarrera, CarreraRequest request) {
        Carrera carrera = carreraRepository.findById(idCarrera)
                .orElseThrow(() -> new ResourceNotFoundException("Carrera no encontrada: " + idCarrera));

        Sede sede = null;
        if (request.getIdSede() != null) {
            sede = sedeRepository.findById(request.getIdSede())
                    .orElseThrow(() -> new ResourceNotFoundException("Sede no encontrada: " + request.getIdSede()));
        }

        carrera.setCodigo(request.getCodigo());
        carrera.setNombre(request.getNombre());
        carrera.setDuracionCiclos(request.getDuracionCiclos());
        carrera.setSede(sede);
        if (request.getEstado() != null) {
            carrera.setEstado(request.getEstado());
        }

        carrera = carreraRepository.save(carrera);
        return toResponse(carrera);
    }

    @Override
    public void cambiarEstado(UUID idCarrera, boolean estado) {
        Carrera carrera = carreraRepository.findById(idCarrera)
                .orElseThrow(() -> new ResourceNotFoundException("Carrera no encontrada: " + idCarrera));
        carrera.setEstado(estado);
        carreraRepository.save(carrera);
    }

    private CarreraResponse toResponse(Carrera c) {
        return CarreraResponse.builder()
                .idCarrera(c.getIdCarrera())
                .codigo(c.getCodigo())
                .nombre(c.getNombre())
                .duracionCiclos(c.getDuracionCiclos())
                .estado(c.getEstado())
                .nombreSede(c.getSede() != null ? c.getSede().getNombre() : null)
                .build();
    }
}