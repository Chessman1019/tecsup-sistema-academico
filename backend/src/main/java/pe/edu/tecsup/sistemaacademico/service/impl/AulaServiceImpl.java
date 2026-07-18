package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.request.AulaRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.AulaResponse;
import pe.edu.tecsup.sistemaacademico.exception.BusinessException;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Aula;
import pe.edu.tecsup.sistemaacademico.repository.AulaRepository;
import pe.edu.tecsup.sistemaacademico.service.AulaService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AulaServiceImpl implements AulaService {

    private final AulaRepository aulaRepository;

    @Override
    public List<AulaResponse> listarTodas() {
        return aulaRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AulaResponse crear(AulaRequest request) {
        Aula aula = Aula.builder()
                .codigo(request.getCodigo())
                .edificio(request.getEdificio())
                .capacidad(request.getCapacidad())
                .tipo(request.getTipo())
                .build();

        aula = aulaRepository.save(aula);
        return toResponse(aula);
    }

    @Override
    public AulaResponse actualizar(UUID idAula, AulaRequest request) {
        Aula aula = aulaRepository.findById(idAula)
                .orElseThrow(() -> new ResourceNotFoundException("Aula no encontrada: " + idAula));

        aula.setCodigo(request.getCodigo());
        aula.setEdificio(request.getEdificio());
        aula.setCapacidad(request.getCapacidad());
        aula.setTipo(request.getTipo());

        aula = aulaRepository.save(aula);
        return toResponse(aula);
    }

    private AulaResponse toResponse(Aula a) {
        return AulaResponse.builder()
                .idAula(a.getIdAula())
                .codigo(a.getCodigo())
                .edificio(a.getEdificio())
                .capacidad(a.getCapacidad())
                .tipo(a.getTipo())
                .build();
    }
}