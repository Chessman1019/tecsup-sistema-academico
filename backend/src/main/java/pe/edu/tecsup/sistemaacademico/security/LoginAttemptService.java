package pe.edu.tecsup.sistemaacademico.security;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int MAX_INTENTOS = 5;
    private static final long BLOQUEO_MINUTOS = 15;

    private static class Intento {
        int cantidad = 0;
        Instant bloqueadoHasta = null;
    }

    private final ConcurrentHashMap<String, Intento> intentosPorUsuario = new ConcurrentHashMap<>();

    public void registrarFallo(String username) {
        String key = username.toLowerCase();
        Intento intento = intentosPorUsuario.computeIfAbsent(key, k -> new Intento());

        synchronized (intento) {
            intento.cantidad++;
            if (intento.cantidad >= MAX_INTENTOS) {
                intento.bloqueadoHasta = Instant.now().plusSeconds(BLOQUEO_MINUTOS * 60);
            }
        }
    }

    public void registrarExito(String username) {
        intentosPorUsuario.remove(username.toLowerCase());
    }

    public boolean estaBloqueado(String username) {
        Intento intento = intentosPorUsuario.get(username.toLowerCase());
        if (intento == null || intento.bloqueadoHasta == null) {
            return false;
        }
        if (Instant.now().isAfter(intento.bloqueadoHasta)) {
            // El bloqueo ya expiro, se limpia el registro
            intentosPorUsuario.remove(username.toLowerCase());
            return false;
        }
        return true;
    }

    public long minutosRestantesBloqueo(String username) {
        Intento intento = intentosPorUsuario.get(username.toLowerCase());
        if (intento == null || intento.bloqueadoHasta == null) {
            return 0;
        }
        long segundosRestantes = Instant.now().until(intento.bloqueadoHasta, java.time.temporal.ChronoUnit.SECONDS);
        return Math.max(0, (segundosRestantes / 60) + 1);
    }

    /**
     * Limpieza periodica de registros expirados para evitar fuga de memoria.
     * Se ejecuta cada hora.
     */
    @Scheduled(fixedRate = 3600000)
    public void limpiarRegistrosExpirados() {
        Instant ahora = Instant.now();
        intentosPorUsuario.entrySet().removeIf(entry -> {
            Intento intento = entry.getValue();
            return intento.bloqueadoHasta != null && ahora.isAfter(intento.bloqueadoHasta);
        });
    }
}