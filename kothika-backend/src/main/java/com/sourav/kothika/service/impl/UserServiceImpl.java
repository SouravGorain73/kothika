package com.sourav.kothika.service.impl;

import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.sourav.kothika.domain.model.User;
import com.sourav.kothika.domain.dto.UserRequestDto;
import com.sourav.kothika.domain.dto.UserResponseDto;
import com.sourav.kothika.repository.UserRepository;
import com.sourav.kothika.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.sourav.kothika.domain.dto.UpdatePasswordRequest;
// ... imports above

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	
	private final UserRepository userRepo;
	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;
	
	public List<UserResponseDto> getUsers(){
		List<User> usersList = userRepo.findAll();
		return usersList.stream()
				.map(user -> modelMapper.map(user, UserResponseDto.class))
				.toList();
	}
	
	public UserResponseDto getUserById(UUID id) {
		User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found with id" + id));
		return modelMapper.map(user, UserResponseDto.class);
	}
	
	public void addUser(UserRequestDto newUser) {
		User user = User.builder()
				.email(newUser.getEmail())
				.name(newUser.getName())
				.password(passwordEncoder.encode(newUser.getPassword()))
				.build();
		userRepo.save(user);
	}
	
	public void deleteUser(UUID id) {
		User delUser = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found with id:" + id));
		userRepo.delete(delUser);
	}
	
	public UserResponseDto updateUser(UUID id, UserRequestDto user) {
		User updatedUser = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found with id:" + id));
		if(user.getName() != null) updatedUser.setName(user.getName());
		if(user.getEmail() != null) updatedUser.setEmail(user.getEmail());
		if(user.getPassword() != null) updatedUser.setPassword(passwordEncoder.encode(user.getPassword()));
		userRepo.save(updatedUser);
		return modelMapper.map(updatedUser, UserResponseDto.class);
	}

	@Override
	public UserResponseDto updateProfile(UserRequestDto user) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User updatedUser = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found!"));
		
		if (user.getName() != null && !user.getName().isBlank()) {
			updatedUser.setName(user.getName());
		}
		if (user.getEmail() != null && !user.getEmail().isBlank()) {
			// Ensure new email is not already taken
			if (!user.getEmail().equals(email) && userRepo.findByEmail(user.getEmail()).isPresent()) {
				throw new RuntimeException("Email is already in use.");
			}
			updatedUser.setEmail(user.getEmail());
		}
		
		userRepo.save(updatedUser);
		return modelMapper.map(updatedUser, UserResponseDto.class);
	}

	@Override
	public void updatePassword(UpdatePasswordRequest request) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found!"));
		
		if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
			throw new RuntimeException("Current password is incorrect.");
		}
		
		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepo.save(user);
	}
}
