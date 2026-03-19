package com.sourav.kothika.domain.dto;

import java.util.Set;
import java.util.UUID;

import com.sourav.kothika.domain.model.PostStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostRequestDto {
	
	@NotBlank(message = "Title cannot be empty")
    @Size(max = 25, message = "Title cannot exceed 25 characters")
    private String title;

    @NotBlank(message = "Content cannot be empty")
    @Size(max = 500, message = "Content cannot exceed 500 characters")
    private String content;

    @NotNull(message = "Category is required")
    private UUID categoryId;

    @NotEmpty(message = "At least one tag is required")
    private Set<UUID> tagIds;

    @NotNull(message = "Post status is required")
    private PostStatus status;

    @NotNull(message = "Reading time is required")
    private Integer readingTime;	
}
