package pe.edu.tecsup.sistemaacademico.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import pe.edu.tecsup.sistemaacademico.security.CustomUserDetailsService;
import pe.edu.tecsup.sistemaacademico.security.JwtAuthFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    /**
     * Origenes permitidos para CORS. En local usa el default (localhost:4200).
     * En produccion se define con la variable de entorno CORS_ORIGINS,
     * por ejemplo: https://tecsup-academico.vercel.app
     * (varios origenes separados por coma)
     */
    @Value("${CORS_ORIGINS:http://localhost:4200}")
    private String corsOrigins;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .headers(headers -> headers
                    .frameOptions(frame -> frame.deny())
                    .contentTypeOptions(contentType -> {})
                    .httpStrictTransportSecurity(hsts -> hsts
                            .includeSubDomains(true)
                            .maxAgeInSeconds(31536000))
                    .contentSecurityPolicy(csp -> csp.policyDirectives(
                            "default-src 'self'; " +
                            "script-src 'self'; " +
                            "style-src 'self' 'unsafe-inline'; " +
                            "img-src 'self' data:; " +
                            "frame-ancestors 'none'"))
                    .referrerPolicy(referrer -> referrer
                            .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
            )

            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/auth/**").permitAll()

                    // Swagger: desactivado por properties en produccion
                    // (springdoc.*.enabled=false salvo SWAGGER_ENABLED=true)
                    .requestMatchers(
                            "/swagger-ui/**",
                            "/swagger-ui.html",
                            "/docs/**",
                            "/v3/api-docs/**",
                            "/v3/api-docs.yaml"
                    ).permitAll()

                    // ===================== PERFIL PROPIO =====================
                    // (debe ir ANTES de /usuarios/** para que no lo capture la regla de ADMIN)
                    .requestMatchers("/usuarios/me/**").authenticated()

                    // ===================== ADMIN =====================
                    .requestMatchers("/usuarios/**").hasRole("ADMIN")
                    .requestMatchers("/roles/**").hasRole("ADMIN")
                    .requestMatchers("/sedes/**").hasRole("ADMIN")
                    .requestMatchers("/carreras/**").hasRole("ADMIN")
                    .requestMatchers("/programas/**").hasRole("ADMIN")
                    .requestMatchers("/periodos-academicos/**").hasRole("ADMIN")
                    .requestMatchers("/auditoria/**").hasRole("ADMIN")

                    // ===================== CONFIGURACION =====================
                    .requestMatchers("/configuracion/**").hasAnyRole(
                            "JEFE_GESTION_ACADEMICA", "ADMIN")

                    // ===================== ESTUDIANTES =====================
                    // FIX anti-IDOR: ESTUDIANTE solo accede a SU perfil (/me).
                    // Antes podia listar los datos personales de todos los alumnos.
                    .requestMatchers("/estudiantes/me").hasAnyRole(
                            "ESTUDIANTE", "ASISTENTE_REGISTRO", "COORDINADOR_ACADEMICO",
                            "JEFE_GESTION_ACADEMICA", "ADMIN")
                    .requestMatchers("/estudiantes/**").hasAnyRole(
                            "ASISTENTE_REGISTRO", "COORDINADOR_ACADEMICO",
                            "JEFE_GESTION_ACADEMICA", "ADMIN")

                    // ===================== CURSOS =====================
                    .requestMatchers(HttpMethod.GET, "/cursos/**").hasAnyRole(
                            "ESTUDIANTE", "ASISTENTE_REGISTRO", "COORDINADOR_ACADEMICO", "DOCENTE",
                            "JEFE_GESTION_ACADEMICA", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/cursos/**").hasAnyRole("COORDINADOR_ACADEMICO", "ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/cursos/**").hasAnyRole("COORDINADOR_ACADEMICO", "ADMIN")
                    .requestMatchers(HttpMethod.PATCH, "/cursos/**").hasAnyRole("COORDINADOR_ACADEMICO", "ADMIN")

                    // ===================== DOCENTES =====================
                    .requestMatchers("/docentes/**").hasAnyRole(
                            "DOCENTE", "COORDINADOR_ACADEMICO", "JEFE_GESTION_ACADEMICA", "ADMIN")

                    // ===================== REPORTES =====================
                    .requestMatchers("/reportes/**").hasAnyRole("JEFE_GESTION_ACADEMICA", "ADMIN")

                    // ===================== HORARIOS =====================
                    .requestMatchers(HttpMethod.GET, "/horarios/**").hasAnyRole(
                            "DOCENTE", "ESTUDIANTE", "ASISTENTE_REGISTRO",
                            "COORDINADOR_ACADEMICO", "JEFE_GESTION_ACADEMICA", "ADMIN")
                    .requestMatchers("/horarios/**").hasAnyRole(
                            "COORDINADOR_ACADEMICO", "JEFE_GESTION_ACADEMICA", "ADMIN")

                    // ===================== AULAS =====================
                    .requestMatchers(HttpMethod.GET, "/aulas/**").hasAnyRole(
                            "COORDINADOR_ACADEMICO", "JEFE_GESTION_ACADEMICA", "DOCENTE", "ESTUDIANTE", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/aulas/**").hasAnyRole("ADMIN", "COORDINADOR_ACADEMICO")
                    .requestMatchers(HttpMethod.PUT, "/aulas/**").hasAnyRole("ADMIN", "COORDINADOR_ACADEMICO")

                    // ===================== MATRICULAS =====================
                    .requestMatchers(HttpMethod.POST, "/matriculas/**").hasAnyRole(
                            "ESTUDIANTE", "ASISTENTE_REGISTRO", "ADMIN")
                    .requestMatchers(HttpMethod.PATCH, "/matriculas/**").hasAnyRole(
                            "ESTUDIANTE", "ASISTENTE_REGISTRO", "ADMIN")
                    .requestMatchers(HttpMethod.GET, "/matriculas/**").hasAnyRole(
                            "ESTUDIANTE", "ASISTENTE_REGISTRO", "COORDINADOR_ACADEMICO", "DOCENTE",
                            "JEFE_GESTION_ACADEMICA", "ADMIN")

                    // ===================== CALIFICACIONES =====================
                    .requestMatchers(HttpMethod.POST, "/calificaciones/**").hasAnyRole(
                            "DOCENTE", "COORDINADOR_ACADEMICO")
                    .requestMatchers(HttpMethod.GET, "/calificaciones/**").hasAnyRole(
                            "DOCENTE", "COORDINADOR_ACADEMICO", "ESTUDIANTE", "JEFE_GESTION_ACADEMICA", "ADMIN")

                    // ===================== ASISTENCIAS =====================
                    .requestMatchers(HttpMethod.POST, "/asistencias/**").hasAnyRole(
                            "DOCENTE", "COORDINADOR_ACADEMICO")
                    .requestMatchers(HttpMethod.GET, "/asistencias/**").hasAnyRole(
                            "DOCENTE", "COORDINADOR_ACADEMICO", "ESTUDIANTE", "JEFE_GESTION_ACADEMICA", "ADMIN")

                    // ===================== CERTIFICADOS =====================
                    .requestMatchers(HttpMethod.POST, "/certificados/**").hasAnyRole(
                            "ESTUDIANTE", "ASISTENTE_REGISTRO")
                    .requestMatchers(HttpMethod.PATCH, "/certificados/**").hasAnyRole(
                            "ASISTENTE_REGISTRO", "ADMIN")
                    .requestMatchers(HttpMethod.GET, "/certificados/**").hasAnyRole(
                            "ESTUDIANTE", "ASISTENTE_REGISTRO", "ADMIN")

                    // ===================== PAGOS =====================
                    // FIX anti-IDOR: ESTUDIANTE solo accede a SUS pagos (/me).
                    // Antes podia listar todos los pagos y ver los de otro alumno por ID.
                    .requestMatchers("/pagos/me").hasAnyRole(
                            "ESTUDIANTE", "ASISTENTE_REGISTRO", "COORDINADOR_ACADEMICO",
                            "JEFE_GESTION_ACADEMICA", "ADMIN")
                    .requestMatchers("/pagos/**").hasAnyRole(
                            "ASISTENTE_REGISTRO", "COORDINADOR_ACADEMICO",
                            "JEFE_GESTION_ACADEMICA", "ADMIN")

                    // ===================== DOCUMENTOS =====================
                    .requestMatchers("/documentos/**").hasAnyRole(
                            "ESTUDIANTE", "ASISTENTE_REGISTRO", "ADMIN")

                    // ===================== EVALUACIONES Y SESIONES =====================
                    .requestMatchers("/evaluaciones/**").hasAnyRole(
                            "DOCENTE", "COORDINADOR_ACADEMICO", "JEFE_GESTION_ACADEMICA")
                    .requestMatchers("/sesiones/**").hasAnyRole("DOCENTE", "COORDINADOR_ACADEMICO")

                    // ===================== MATERIALES =====================
                    .requestMatchers("/materiales/**").hasAnyRole(
                            "DOCENTE", "ESTUDIANTE", "COORDINADOR_ACADEMICO")

                    // ===================== INCIDENCIAS =====================
                    .requestMatchers("/incidencias/**").hasAnyRole(
                            "COORDINADOR_ACADEMICO", "JEFE_GESTION_ACADEMICA")

                    // ===================== NOTIFICACIONES =====================
                    .requestMatchers("/notificaciones/**").authenticated()

                    .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(corsOrigins.split(",")));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}