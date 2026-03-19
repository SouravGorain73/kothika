package com.sourav.kothika.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.sourav.kothika.domain.model.User;
import com.sourav.kothika.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService{
	
	private final UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
		User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found with email:" + email));
		return new CustomUserDetails(user);
	}

}
