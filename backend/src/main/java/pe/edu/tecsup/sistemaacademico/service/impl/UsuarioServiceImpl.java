package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.request.UsuarioRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.UsuarioResponse;
import pe.edu.tecsup.sistemaacademico.exception.BusinessException;
import pe.edu.tecsup.sistemaacademico.exception.ResourceNotFoundException;
import pe.edu.tecsup.sistemaacademico.model.Rol;
import pe.edu.tecsup.sistemaacademico.model.Usuario;
import pe.edu.tecsup.sistemaacademico.repository.RolRepository;
import pe.edu.tecsup.sistemaacademico.repository.UsuarioRepository;
import pe.edu.tecsup.sistemaacademico.service.UsuarioService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioResponse obtenerPorId(UUID idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + idUsuario));
        return toResponse(usuario);
    }

    @Override
    public UsuarioResponse crear(UsuarioRequest request) {
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("El username '" + request.getUsername() + "' ya existe.");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BusinessException("La contraseña es obligatoria al crear un usuario.");
        }

        Rol rol = rolRepository.findByNombre(request.getNombreRol())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado: " + request.getNombreRol()));

        Usuario usuario = Usuario.builder()
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .estado(request.getEstado() != null ? request.getEstado() : true)
                .rol(rol)
                .build();

        usuario = usuarioRepository.save(usuario);
        return toResponse(usuario);
    }

    @Override
    public UsuarioResponse actualizar(UUID idUsuario, UsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + idUsuario));

        if (!usuario.getUsername().equalsIgnoreCase(request.getUsername())
                && usuarioRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("El username '" + request.getUsername() + "' ya esta en uso.");
        }

        Rol rol = rolRepository.findByNombre(request.getNombreRol())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado: " + request.getNombreRol()));

        usuario.setUsername(request.getUsername());
        usuario.setRol(rol);
        if (request.getEstado() != null) {
            usuario.setEstado(request.getEstado());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        usuario = usuarioRepository.save(usuario);
        return toResponse(usuario);
    }

    @Override
    public void cambiarEstado(UUID idUsuario, boolean estado) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + idUsuario));
        usuario.setEstado(estado);
        usuarioRepository.save(usuario);
    }

    @Override
    public void eliminar(UUID idUsuario) {
        if (!usuarioRepository.existsById(idUsuario)) {
            throw new ResourceNotFoundException("Usuario no encontrado: " + idUsuario);
        }
        usuarioRepository.deleteById(idUsuario);
    }

    @Override
    public String obtenerFoto(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + username));
        return usuario.getFoto();
    }

    @Override
    public void actualizarFoto(String username, String foto) {
        if (foto == null || foto.isBlank()) {
            throw new BusinessException("La imagen es obligatoria.");
        }

        if (!foto.startsWith("data:image/")) {
            throw new BusinessException("El formato de la imagen no es valido.");
        }

        // Limite ~700 KB en base64 para no inflar la base de datos
        if (foto.length() > 700_000) {
            throw new BusinessException("La imagen es demasiado grande. Usa una imagen menor a 500 KB.");
        }

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + username));

        usuario.setFoto(foto);
        usuarioRepository.save(usuario);
    }

    private UsuarioResponse toResponse(Usuario u) {
        return UsuarioResponse.builder()
                .idUsuario(u.getIdUsuario())
                .username(u.getUsername())
                .rol(u.getRol().getNombre())
                .estado(u.getEstado())
                .ultimoAcceso(u.getUltimoAcceso())
                .build();
    }
}