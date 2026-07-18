package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.request.LoginRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.LoginResponse;
import pe.edu.tecsup.sistemaacademico.exception.AccountLockedException;
import pe.edu.tecsup.sistemaacademico.model.Usuario;
import pe.edu.tecsup.sistemaacademico.repository.UsuarioRepository;
import pe.edu.tecsup.sistemaacademico.security.JwtTokenProvider;
import pe.edu.tecsup.sistemaacademico.security.LoginAttemptService;
import pe.edu.tecsup.sistemaacademico.service.AuditoriaService;
import pe.edu.tecsup.sistemaacademico.service.AuthService;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioRepository usuarioRepository;
    private final LoginAttemptService loginAttemptService;
    private final AuditoriaService auditoriaService;

    @Override
    public LoginResponse login(LoginRequest request) {

        if (loginAttemptService.estaBloqueado(request.getUsername())) {
            long minutos = loginAttemptService.minutosRestantesBloqueo(request.getUsername());
            throw new AccountLockedException(
                    "Cuenta bloqueada temporalmente por multiples intentos fallidos. " +
                            "Intenta de nuevo en " + minutos + " minuto(s).");
        }

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(), request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            loginAttemptService.registrarFallo(request.getUsername());
            throw ex;
        }

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow();

        if (request.getRol() != null && !request.getRol().isBlank()
                && !usuario.getRol().getNombre().equalsIgnoreCase(request.getRol())) {
            loginAttemptService.registrarFallo(request.getUsername());
            throw new BadCredentialsException("Usuario o contraseña incorrectos");
        }

        loginAttemptService.registrarExito(request.getUsername());

        String token = jwtTokenProvider.generarToken(authentication);

        usuario.setUltimoAcceso(LocalDateTime.now());
        usuarioRepository.save(usuario);

        auditoriaService.registrar("LOGIN", "Usuario", "Inicio de sesion exitoso", usuario.getUsername());

        return new LoginResponse(token, usuario.getUsername(), usuario.getRol().getNombre());
    }
}