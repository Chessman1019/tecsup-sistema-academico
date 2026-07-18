package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.tecsup.sistemaacademico.dto.request.ConfiguracionRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.ConfiguracionResponse;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Configuracion;
import pe.edu.tecsup.sistemaacademico.repository.ConfiguracionRepository;
import pe.edu.tecsup.sistemaacademico.service.AuditoriaService;
import pe.edu.tecsup.sistemaacademico.service.ConfiguracionService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConfiguracionServiceImpl implements ConfiguracionService {

    private final ConfiguracionRepository configuracionRepository;
    private final AuditoriaService auditoriaService;

    @Override
    public List<ConfiguracionResponse> listarTodas() {
        return configuracionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ConfiguracionResponse actualizarValor(UUID idConfiguracion, ConfiguracionRequest request) {
        Configuracion configuracion = configuracionRepository.findById(idConfiguracion)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Configuracion no encontrada: " + idConfiguracion));

        String valorAnterior = configuracion.getValor();
        configuracion.setValor(request.getValor());
        configuracion = configuracionRepository.save(configuracion);

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        auditoriaService.registrar(
                "ACTUALIZAR_CONFIGURACION",
                "Configuracion",
                "Parametro '" + configuracion.getClave() + "' cambiado de '"
                        + valorAnterior + "' a '" + configuracion.getValor() + "'",
                username);

        return toResponse(configuracion);
    }

    private ConfiguracionResponse toResponse(Configuracion c) {
        return ConfiguracionResponse.builder()
                .idConfiguracion(c.getIdConfiguracion())
                .clave(c.getClave())
                .valor(c.getValor())
                .descripcion(c.getDescripcion())
                .categoria(c.getCategoria())
                .build();
    }
}