package io.bootify.helisys.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.session.InvalidSessionStrategy;
import org.springframework.security.web.session.SessionInformationExpiredStrategy;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                     "/robots.txt",
                    "/assets/**", "/icons/**", "/image/**", "/images/**", "/public/**",
                    "/*.js", "/*.css", "/*.map", "/*.json", "/*.png", "/*.jpg", "/*.svg", "/*.webp",
                    "/login", "/logout", "/error", "/webjars/**"
                ).permitAll()
                .requestMatchers("/api/auth/**", "/api/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .defaultSuccessUrl("/", true)
                .failureUrl("/login?error")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
                .invalidateHttpSession(true)
                .deleteCookies("SESSION", "remember-me")
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .sessionFixation(fix -> fix.migrateSession())
                .invalidSessionStrategy(invalidSessionStrategy())
                .maximumSessions(1)
                .maxSessionsPreventsLogin(false)
                .expiredSessionStrategy(expiredStrategy())
            );

        httpSecurity.exceptionHandling(ex -> ex
            .defaultAuthenticationEntryPointFor(
                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                new RequestMatcher() {
                    @Override
                    public boolean matches(HttpServletRequest request) {
                        String uri = request.getRequestURI();
                        String accept = String.valueOf(request.getHeader("Accept"));
                        String xhr = String.valueOf(request.getHeader("X-Requested-With"));
                        return uri.startsWith("/api")
                            || accept.contains("application/json")
                            || "XMLHttpRequest".equalsIgnoreCase(xhr);
                    }
                }
            )
        );

        return httpSecurity.build();
    }

    @Bean
    WebSecurityCustomizer webSecurityCustomizer() {
        return web -> web.ignoring().requestMatchers(
            PathRequest.toStaticResources().atCommonLocations()
        );
    }

    @Bean
    public org.springframework.security.web.session.HttpSessionEventPublisher httpSessionEventPublisher() {
        return new org.springframework.security.web.session.HttpSessionEventPublisher();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails admin = User.builder()
            .username("CIDAR")
            .password(passwordEncoder.encode("adminPass"))
            .roles("ADMIN")
            .build();

        UserDetails user = User.builder()
            .username("Juan Pablo")
            .password(passwordEncoder.encode("123"))
            .roles("USER")
            .build();

        return new InMemoryUserDetailsManager(admin, user);
    }

    @Bean
    public InvalidSessionStrategy invalidSessionStrategy() {
        return (request, response) -> {
            String uri    = request.getRequestURI();
            String accept = String.valueOf(request.getHeader("Accept"));
            String xhr    = String.valueOf(request.getHeader("X-Requested-With"));
            boolean isApi = uri.startsWith("/api")
                || accept.contains("application/json")
                || "XMLHttpRequest".equalsIgnoreCase(xhr);

            if (isApi) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            boolean hasReferer = request.getHeader("Referer") != null && !request.getHeader("Referer").isEmpty();

            var session = request.getSession(true);

            if (hasReferer) {
                session.setAttribute("timeoutOnce", Boolean.TRUE);
            }
            response.sendRedirect("/login");
        };
    }


    @Bean
    public SessionInformationExpiredStrategy expiredStrategy() {
        return event -> {
            HttpServletRequest req = event.getRequest();
            HttpServletResponse res = event.getResponse();

            String uri = req.getRequestURI();
            String accept = String.valueOf(req.getHeader("Accept"));
            boolean isApi = uri.startsWith("/api") || accept.contains("application/json");

            if (isApi) {
                res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            } else {
                req.getSession(true);
                res.sendRedirect("/login?timeout");
            }
        };
    }
}
