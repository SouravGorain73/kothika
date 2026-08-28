package com.sourav.kothika.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.UUID;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvFileSource;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.sourav.kothika.domain.model.User;
import com.sourav.kothika.repository.UserRepository;

@SpringBootTest
public class UserServiceTests {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UserService userService;
	
	@Disabled
	@Test
	public void testAdd() {
		assertEquals(4, 2  + 2);
	}

//	@Disabled
	@ParameterizedTest
	@ValueSource(strings={
		"0ed041a0-4b97-4b50-86a1-cda1dfe1dfda",
		"249f4558-1f9c-45e5-bb18-e8ea1f328aa9",
		"3c40d5e5-4eba-4578-b71d-bce9fa82abc8"
	})
	public void testFindByEmail(UUID id) {
		assertNotNull(userService.getUserById(id));
	}
	
	@ParameterizedTest
	@CsvSource({
		"1, 1, 2",
		"3, 4, 8",
		"2, 10, 12"
	})
	public void test(int a, int b, int expected) {
		assertEquals(expected, a + b);
	}
	
	
}
