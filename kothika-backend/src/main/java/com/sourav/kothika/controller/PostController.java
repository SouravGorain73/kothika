package com.sourav.kothika.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sourav.kothika.domain.dto.PostRequestDto;
import com.sourav.kothika.domain.dto.PostResponseDto;
import com.sourav.kothika.service.PostService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
@RestController
@RequestMapping("/kothika/posts")
@RequiredArgsConstructor
public class PostController {
	
	private final PostService postService;
	
	@GetMapping("/getAll")
	public ResponseEntity<List<PostResponseDto>> getAllPosts(){
		List<PostResponseDto> postList = postService.getAllPosts();
		return ResponseEntity.ok(postList);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<PostResponseDto> getPostById(@PathVariable UUID id){
		PostResponseDto post = postService.getPostById(id);
		return new ResponseEntity<PostResponseDto>(post, HttpStatus.OK);
	}
	
	@PostMapping("/create")
	public ResponseEntity<PostResponseDto> createPost(@RequestBody PostRequestDto postRequestDto){
		PostResponseDto newPost = postService.createPost(postRequestDto);
		return new ResponseEntity<PostResponseDto>(newPost, HttpStatus.CREATED);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deletePost(@PathVariable UUID id){
		String message = postService.deletePost(id);
		return new ResponseEntity<String>(message, HttpStatus.OK);
	}
	
	@PutMapping("/update/{id}")
	public ResponseEntity<PostResponseDto> updatePost(@PathVariable UUID id, @RequestBody PostRequestDto postRequestDto){
		PostResponseDto updatedPost = postService.updatePost(id, postRequestDto);
		return new ResponseEntity<PostResponseDto>(updatedPost, HttpStatus.OK);
	}
	
	@GetMapping("/drafts")
	public ResponseEntity<List<PostResponseDto>> fetchAllPublishedPosts(){
		List<PostResponseDto> draftPosts = postService.getAllPublishedPostsOfUser();
		return new ResponseEntity<List<PostResponseDto>>(draftPosts, HttpStatus.OK);
	}
	
	@PostMapping("/published")
	public ResponseEntity<List<PostResponseDto>> fetchAllDraftPosts(){
		List<PostResponseDto> publishedPosts = postService.getAllDraftPostsOfUser();
		return new ResponseEntity<List<PostResponseDto>>(publishedPosts, HttpStatus.OK);
	}
	
}
