package pe.edu.tecsup.sistemaacademico.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import pe.edu.tecsup.sistemaacademico.model.Usuario;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Getter
public class CustomUserDetails extends User {

    private final UUID idUsuario;
    private final String rol;

    public CustomUserDetails(Usuario usuario) {
        super(
                usuario.getUsername(),
                usuario.getPasswordHash(),
                usuario.getEstado(),
                true, true, true,
                mapAuthorities(usuario)
        );
        this.idUsuario = usuario.getIdUsuario();
        this.rol = usuario.getRol().getNombre();
    }

    private static Collection<? extends GrantedAuthority> mapAuthorities(Usuario usuario) {
        String rolNombre = "ROLE_" + usuario.getRol().getNombre();
        return List.of(new SimpleGrantedAuthority(rolNombre));
    }
}