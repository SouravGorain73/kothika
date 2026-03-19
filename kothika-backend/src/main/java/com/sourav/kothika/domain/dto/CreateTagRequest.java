package com.sourav.kothika.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTagRequest {
	
	@NotBlank(message = "Tag name is required")
	@Size(min = 2, max = 50, message = "Tag name must be between {min} and {max} characters")
	@Pattern(regexp = "^[\\w\\s-]+$", message = "Tag name can only contain	letters, numbers, spaces and hyphens")
	private String name;

}
