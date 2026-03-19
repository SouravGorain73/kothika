package com.sourav.kothika.service.impl;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.sourav.kothika.service.AuthenticationService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService{
	
	private final AuthenticationManager authenticationManager;
	private final UserDetailsService userDetailsService;
	
	private final Long jwtExpiryMs = 86400000L;
	
	@Value("${jwt.secretKey}")
	private String secretKey;

	@Override
	public UserDetails authenticate(String email, String password) {
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
		
		return userDetailsService.loadUserByUsername(email);
	}

	@Override
	public String generateToken(UserDetails userDetails) {
		return Jwts.builder()
				.subject(userDetails.getUsername())
				.issuedAt(new Date(System.currentTimeMillis()))
				.claim("userId", userDetails.getUsername())
				.expiration(new Date(System.currentTimeMillis() + jwtExpiryMs))
				.signWith(getSignKey())
				.compact();
	}
	
	private SecretKey getSignKey() {
		return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
	}

	@Override
	public UserDetails validateToken(String token) {
		String username = extractUsernameFromToken(token);
		
		return userDetailsService.loadUserByUsername(username);
	}
	
	private String extractUsernameFromToken(String token) {
		Claims claims = Jwts.parser()
				.verifyWith(getSignKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
		
		return claims.getSubject();
	}

}
