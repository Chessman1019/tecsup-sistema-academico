package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.response.SesionResponse;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Horario;
import pe.edu.tecsup.sistemaacademico.model.Sesion;
import pe.edu.tecsup.sistemaacademico.repository.HorarioRepository;
import pe.edu.tecsup.sistemaacademico.repository.SesionRepository;
import pe.edu.tecsup.sistemaacademico.service.SesionService;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SesionServiceImpl implements SesionService {

    private final SesionRepository sesionRepository;
    private final HorarioRepository horarioRepository;

    @Override
    public SesionResponse obtenerOCrearSesionDeHoy(UUID idHorario) {
        Horario horario = horarioRepository.findById(idHorario)
                .orElseThrow(() -> new ResourceNotFoundException("Horario no encontrado: " + idHorario));

        LocalDate hoy = LocalDate.now();

        Sesion sesion = sesionRepository.findByHorario_IdHorario(idHorario).stream()
                .filter(s -> s.getFechaSesion().isEqual(hoy))
                .findFirst()
                .orElseGet(() -> {
                    long semanasDesdeInicio = ChronoUnit.WEEKS.between(hoy.minusMonths(4), hoy) + 1;
                    Sesion nueva = Sesion.builder()
                            .horario(horario)
                            .fechaSesion(hoy)
                            .tema("Sesion del " + hoy)
                            .semana((int) semanasDesdeInicio)
                            .build();
                    return sesionRepository.save(nueva);
                });

        return toResponse(sesion);
    }

    @Override
    public List<SesionResponse> listarPorHorario(UUID idHorario) {
        return sesionRepository.findByHorario_IdHorario(idHorario)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private SesionResponse toResponse(Sesion s) {
        return SesionResponse.builder()
                .idSesion(s.getIdSesion())
                .fechaSesion(s.getFechaSesion())
                .tema(s.getTema())
                .semana(s.getSemana())
                .idHorario(s.getHorario().getIdHorario())
                .nombreCurso(s.getHorario().getCurso().getNombre())
                .build();
    }
}