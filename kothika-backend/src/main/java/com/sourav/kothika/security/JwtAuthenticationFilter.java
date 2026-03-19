package com.sourav.kothika.security;


import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import com.sourav.kothika.service.AuthenticationService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter{
	
	private final AuthenticationService authenticationService;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
		
		try {
			String token = extractToken(request);
			
			if(token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				UserDetails userDetails = authenticationService.validateToken(token);
				
				UsernamePasswordAuthenticationToken authenticate = 
						new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
				
				SecurityContextHolder.getContext().setAuthentication(authenticate);
			}
			
		}
		catch (Exception ex) {
			// TODO: handle exception
			log.warn("Invalid JWT token");
		}
		
		filterChain.doFilter(request, response);
		
	}
	
	private String extractToken(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");
		
		if(bearerToken != null && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}
		else {
			return null;
		}
	}

}
