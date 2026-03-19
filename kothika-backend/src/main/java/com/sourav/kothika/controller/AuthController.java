package com.sourav.kothika.controller;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sourav.kothika.domain.dto.AuthResponse;
import com.sourav.kothika.domain.dto.LoginRequest;
import com.sourav.kothika.domain.dto.UserRequestDto;
import com.sourav.kothika.domain.dto.UserResponseDto;
import com.sourav.kothika.domain.model.User;
import com.sourav.kothika.repository.UserRepository;
import com.sourav.kothika.service.AuthenticationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/kothika/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class AuthController {

	private final AuthenticationService authenticationService;
	private final UserRepository userRepository;
	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;
	
	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest){
		UserDetails userDetails = authenticationService
				.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
		
		String tokenValue = authenticationService.generateToken(userDetails);
		
		AuthResponse authResponse = AuthResponse.builder()
				.token(tokenValue)
				.expiresIn(86400)
				.build();
		
		return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);
	}
	
	@PostMapping("/register")
	public ResponseEntity<UserResponseDto> register(@RequestBody UserRequestDto userRequestDto){
		
		if(userRepository.existsByEmail(userRequestDto.getEmail())) {
			throw new IllegalArgumentException("User already exists");
		}
		
		User user = modelMapper.map(userRequestDto, User.class);
		
		user = userRepository.save(User.builder()
				.email(userRequestDto.getEmail())
				.password(passwordEncoder.encode(userRequestDto.getPassword()))
				.name(userRequestDto.getName())
				.build()
		);
		
		UserResponseDto userResponseDto = new UserResponseDto(user.getId(), user.getEmail(), user.getName());
		return new ResponseEntity<UserResponseDto>(userResponseDto, HttpStatus.CREATED);
	}
	
}
