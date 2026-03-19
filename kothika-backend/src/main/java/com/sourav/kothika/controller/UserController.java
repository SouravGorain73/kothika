package com.sourav.kothika.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.sourav.kothika.domain.dto.UserRequestDto;
import com.sourav.kothika.domain.dto.UserResponseDto;
import com.sourav.kothika.domain.model.User;
import com.sourav.kothika.repository.UserRepository;
import com.sourav.kothika.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/kothika/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class UserController{
	
	private final UserService userService;
	private final UserRepository userRepository;
	private final ModelMapper modelMapper;
	@PostMapping("/add")
	ResponseEntity<String> addUser(@RequestBody UserRequestDto newUser){
		userService.addUser(newUser);
		String message = "User added successfully";
		return new ResponseEntity<>(message, HttpStatus.CREATED);
	}
	
	@GetMapping("/getAll")
	ResponseEntity<List<UserResponseDto>> getAllUsers(){
		List<UserResponseDto> userList = userService.getUsers();
		return new ResponseEntity<List<UserResponseDto>>(userList, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	ResponseEntity<UserResponseDto> getUserById(@PathVariable UUID id){
		UserResponseDto user = userService.getUserById(id);
		return new ResponseEntity<UserResponseDto>(user, HttpStatus.OK);
	}
	
	@GetMapping("/me")
	ResponseEntity<UserResponseDto> getCurrentUser(Authentication auth){
		String email = auth.getName();
		Optional<User> currentUser = userRepository.findByEmail(email);
		if(currentUser == null) {
			throw new RuntimeException("User does not exists!");
		}
		UserResponseDto currentUserDto = modelMapper.map(currentUser, UserResponseDto.class);
		return new ResponseEntity<UserResponseDto>(currentUserDto, HttpStatus.OK);
	}
	
	@DeleteMapping("/delete/{id}")
	ResponseEntity<String> deleteUser(@PathVariable UUID id){
		userService.deleteUser(id);
		String message = "User deleted successfully";
		return new ResponseEntity<String>(message, HttpStatus.OK);
	}
	
	@PutMapping("/update/{id}")
	ResponseEntity<UserResponseDto> updateUser(@PathVariable UUID id, @RequestBody UserRequestDto user){
		UserResponseDto updatedUser = userService.updateUser(id, user);
		return new ResponseEntity<UserResponseDto>(updatedUser, HttpStatus.CREATED);
	}
}
