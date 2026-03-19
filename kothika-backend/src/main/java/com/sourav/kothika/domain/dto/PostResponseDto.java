package com.sourav.kothika.domain.dto;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import com.sourav.kothika.domain.model.PostStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponseDto {
	
	private UUID id;
    private String title;
    private String content;
    private String authorName;
    private UUID categoryId;
    private String categoryName;
    private Set<String> tags;
    private PostStatus status;
    private Integer readingTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
