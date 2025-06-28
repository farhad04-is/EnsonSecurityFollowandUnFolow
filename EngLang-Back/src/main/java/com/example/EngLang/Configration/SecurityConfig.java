package com.example.EngLang.Configration;

import com.example.EngLang.Service.Security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // 🔄 Yeni sintaksis (Security 6+) - CSRF-i söndürürük, çünki JWT istifadə edirik
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ CORS-u aktivləşdiririk və konfiqurasiyamızı tətbiq edirik
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN") // /admin/ olan sorğular yalnız ADMIN rolu üçün
                        .requestMatchers("/v1/EngLang/**").hasAnyRole("USER")
                        .requestMatchers("/api/follow/**").hasAnyRole("USER")
                        .anyRequest().authenticated() // Qalan bütün sorğular üçün autentifikasiya tələb et
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Sessiyaları state-less edirik (JWT üçün vacibdir)
                );

        // JWT filtirini UsernamePasswordAuthenticationFilter-dən əvvəl əlavə edirik
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Frontend ünvanınızı burada əlavə edin
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
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
