package com.sourav.kothika.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.sourav.kothika.security.JwtAuthenticationFilter;
import com.sourav.kothika.service.AuthenticationService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
	
	@Bean
	public JwtAuthenticationFilter jwtAuthenticationFilter(AuthenticationService authenticationService) {
		return new JwtAuthenticationFilter(authenticationService);
	}
	
	
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception{
		httpSecurity
		.cors(Customizer.withDefaults())
		.authorizeHttpRequests(auth -> auth
				.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				.requestMatchers("/kothika/auth/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/kothika/categories/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/kothika/posts/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/kothika/tags/**").permitAll()
				.requestMatchers("/kothika/users/me/**").authenticated()	
				.anyRequest().authenticated()
				)
		.csrf(csrf -> csrf.disable())
		.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
		.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
		
		return httpSecurity.build();
	}
	
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception{
		return configuration.getAuthenticationManager();
	}
	
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
}
