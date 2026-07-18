package pe.edu.tecsup.sistemaacademico;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SistemaAcademicoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SistemaAcademicoApplication.class, args);
    }

}