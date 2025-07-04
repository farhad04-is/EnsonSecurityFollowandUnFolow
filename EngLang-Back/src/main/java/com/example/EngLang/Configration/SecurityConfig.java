package com.example.EngLang.Configration;

import com.example.EngLang.Service.Security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

 // Bu import'u eklediğinizden emin olun

// ... diğer import'lar

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        // GET /videolist/** (getAllVideoLists gibi) herkes için açık
                        .requestMatchers(HttpMethod.GET, "/videolist/**").permitAll()
                        .requestMatchers("/chat", "/chat/**", "/ws/**").permitAll() // WebSocket icazəsi


                        // PUT /videolist/{id}/like (likeVideo gibi) herkes için açık
                        .requestMatchers(HttpMethod.PUT, "/videolist/{id}/like").permitAll()

                        .requestMatchers("/admin/**").permitAll()
                        .requestMatchers("/v1/EngLang/**").permitAll()
                        .requestMatchers("/user/**").permitAll()
                        .requestMatchers("/api/follow/**").permitAll()
                        .anyRequest().permitAll() // Diğer tüm istekler kimlik doğrulaması gerektirir
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // ⭐️ frontend domainin
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        // Şifrələri BCrypt istifadə edərək encode etmək üçün PasswordEncoder bean-ı
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        // Autentifikasiya prosesini idarə edən AuthenticationManager bean-ı
        return authenticationConfiguration.getAuthenticationManager();
    }
}
