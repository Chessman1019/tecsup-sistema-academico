package pe.edu.tecsup.sistemaacademico.exception;

public class AccountLockedException extends RuntimeException {
    public AccountLockedException(String mensaje) {
        super(mensaje);
    }
}