package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.ConfiguracionRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.ConfiguracionResponse;

import java.util.List;
import java.util.UUID;

public interface ConfiguracionService {

    List<ConfiguracionResponse> listarTodas();

    ConfiguracionResponse actualizarValor(UUID idConfiguracion, ConfiguracionRequest request);
}