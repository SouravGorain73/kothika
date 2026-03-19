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

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
	
	private final UserRepository userRepo;
	private final ModelMapper modelMapper;
	
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
				.password(newUser.getPassword())
				.build();
		userRepo.save(user);
	}
	
	public void deleteUser(UUID id) {
		User delUser = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found with id:" + id));
		userRepo.delete(delUser);
	}
	
	public UserResponseDto updateUser(UUID id, UserRequestDto user) {
		User updatedUser = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found with id:" + id));
		modelMapper.map(user, updatedUser);
		userRepo.save(updatedUser);
		return modelMapper.map(updatedUser, UserResponseDto.class);
	}
	
}
