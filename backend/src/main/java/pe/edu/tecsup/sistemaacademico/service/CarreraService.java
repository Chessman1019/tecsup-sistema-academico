package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.CarreraRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.CarreraResponse;

import java.util.List;
import java.util.UUID;

public interface CarreraService {

    List<CarreraResponse> listarTodas();

    CarreraResponse crear(CarreraRequest request);

    CarreraResponse actualizar(UUID idCarrera, CarreraRequest request);

    void cambiarEstado(UUID idCarrera, boolean estado);
}