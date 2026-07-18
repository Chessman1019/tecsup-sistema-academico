package pe.edu.tecsup.sistemaacademico.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String username;
    private String rol;
    private String tipo = "Bearer";

    public LoginResponse(String token, String username, String rol) {
        this.token = token;
        this.username = username;
        this.rol = rol;
        this.tipo = "Bearer";
    }
}