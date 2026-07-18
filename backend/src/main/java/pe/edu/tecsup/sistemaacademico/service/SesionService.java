package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.response.SesionResponse;

import java.util.List;
import java.util.UUID;

public interface SesionService {

    SesionResponse obtenerOCrearSesionDeHoy(UUID idHorario);

    List<SesionResponse> listarPorHorario(UUID idHorario);
}