package com.sourav.kothika.service;

import java.util.List;
import java.util.UUID;

import com.sourav.kothika.domain.dto.PostRequestDto;
import com.sourav.kothika.domain.dto.PostResponseDto;

public interface PostService {
	
	public PostResponseDto getPostById(UUID id);
	public List<PostResponseDto> getAllPosts();
	public List<PostResponseDto> getAllPublishedPostsOfUser();
	public List<PostResponseDto> getAllDraftPostsOfUser();
	public PostResponseDto createPost(PostRequestDto postRequestDto);
	public String deletePost(UUID id);
	public PostResponseDto updatePost(UUID id, PostRequestDto postRequestDto);
}
