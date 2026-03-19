package com.sourav.kothika.domain.dto;

import java.util.UUID;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
	private UUID id;
	private String email;
	private String name;
}
