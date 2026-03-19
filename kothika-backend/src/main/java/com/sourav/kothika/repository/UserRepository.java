package com.sourav.kothika.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sourav.kothika.domain.dto.UserResponseDto;
import com.sourav.kothika.domain.model.User;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, UUID>{
	
	public Optional<User> findByEmail(String email);
	
	public boolean existsByEmail(String email);
}
