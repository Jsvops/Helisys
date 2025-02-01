package io.bootify.helisys.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/transaccion-combinada-add").hasRole("USER")
                .anyRequest().authenticated() // Requiere autenticación para cualquier otra solicitud
            )
            .formLogin(form -> form
                .successHandler(successHandler()) // Gestiona el redireccionamiento después de iniciar sesión
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessHandler(logoutSuccessHandler())
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
                .invalidSessionUrl("/login")
                .maximumSessions(1)
                .expiredUrl("/login")
            );
            /*.sessionFixation(sessionFixation -> sessionFixation
                .migrateSession()
            );*/

        return httpSecurity.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails admin = User.withDefaultPasswordEncoder()
            .username("admin")
            .password("adminPass")
            .roles("ADMIN")
            .build();

        UserDetails user = User.withDefaultPasswordEncoder()
            .username("user")
            .password("userPass")
            .roles("USER")
            .build();

        return new InMemoryUserDetailsManager(admin, user);
    }

    @Bean
    public AuthenticationSuccessHandler successHandler() {
        return (request, response, authentication) -> {
            String role = authentication.getAuthorities().stream()
                .findFirst().orElseThrow(() -> new IllegalStateException("No roles found")).getAuthority();
            if ("ROLE_ADMIN".equals(role)) {
                response.sendRedirect("/"); // Redirige al home predeterminado para admin
            } else if ("ROLE_USER".equals(role)) {
                response.sendRedirect("/transaccion-combinada-add"); // Redirige a la URL específica de user
            } else {
                response.sendRedirect("/"); // URL por defecto
            }
        };
    }

    @Bean
    public LogoutSuccessHandler logoutSuccessHandler() {
        return (request, response, authentication) -> response.sendRedirect("/login?logout");
    }
}
