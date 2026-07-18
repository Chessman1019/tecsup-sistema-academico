package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.LoginRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}