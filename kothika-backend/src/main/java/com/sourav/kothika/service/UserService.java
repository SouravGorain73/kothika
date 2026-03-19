package com.sourav.kothika.service;

import java.util.List;
import java.util.UUID;

import com.sourav.kothika.domain.dto.UserRequestDto;
import com.sourav.kothika.domain.dto.UserResponseDto;

public interface UserService {
	
	public List<UserResponseDto> getUsers();
	
	public UserResponseDto getUserById(UUID id);
	
	public void addUser(UserRequestDto newUser);
	
	public void deleteUser(UUID id);
	
	public UserResponseDto updateUser(UUID id, UserRequestDto user);
	
}
