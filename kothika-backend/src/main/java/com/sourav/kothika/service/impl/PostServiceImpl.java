package com.sourav.kothika.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.sourav.kothika.domain.dto.PostRequestDto;
import com.sourav.kothika.domain.dto.PostResponseDto;
import com.sourav.kothika.domain.model.Category;
import com.sourav.kothika.domain.model.Post;
import com.sourav.kothika.domain.model.Tag;
import com.sourav.kothika.domain.model.User;
import com.sourav.kothika.repository.CategoryRepository;
import com.sourav.kothika.repository.PostRepository;
import com.sourav.kothika.repository.TagRepository;
import com.sourav.kothika.repository.UserRepository;
import com.sourav.kothika.service.PostService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService{
	
	private final PostRepository postRepository;
	private final ModelMapper modelMapper;
	private final CategoryRepository categoryRepository;
	private final TagRepository tagRepository;
	private final UserRepository userRepository;

	@Override
	public PostResponseDto getPostById(UUID id){
		Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post doesn't exists with id:" + id));
		return modelMapper.map(post, PostResponseDto.class);
	}

	@Override
	public List<PostResponseDto> getAllPosts() {
		List<Post> postList = postRepository.findAll();
		return postList.stream()
				.map(post -> modelMapper.map(post, PostResponseDto.class))
				.toList();
	}

	@Override
	public PostResponseDto createPost(PostRequestDto postRequestDto){
		Category category = categoryRepository.findById(postRequestDto.getCategoryId()).orElseThrow(() -> new RuntimeException("Category not found Exception!"));
		
		Set<Tag> tags = new HashSet<>(tagRepository.findAllById(postRequestDto.getTagIds()));
		
		if(tags.size() != postRequestDto.getTagIds().size()) {
			throw new RuntimeException("One or more tags not found");
		}
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		
		User user = userRepository.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("User does not exists!"));
		
		Post post = new Post();
		
		post.setAuthor(user);
		post.setCategory(category);
		post.setTags(tags);
		post.setTitle(postRequestDto.getTitle());
		post.setContent(postRequestDto.getContent());
		post.setReadingTime(postRequestDto.getReadingTime());
		post.setStatus(postRequestDto.getStatus());
		
		Post newSavedPost = postRepository.save(post);
		
		return modelMapper.map(newSavedPost, PostResponseDto.class);
	}

	@Override
	public String deletePost(UUID id) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		System.out.println(email);
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User does not exists!"));
		System.out.println(user);  
		Post post = postRepository.findByIdAndAuthor(id, user).orElseThrow(() -> new RuntimeException("Post does not exists!"));
		System.out.println(post);
		postRepository.delete(post);
		String msg = "Post deleted successfully";
		return msg;
		
//		if(delPost != null) {
//			postRepository.delete(delPost);
//			String msg = "Post deleted successfully";
//			return msg;
//		}
//		else {
//			String msg = "Post doesn't exist with id:" + id;
//			return msg;
//		}
	}

	@Override
	public PostResponseDto updatePost(UUID id, PostRequestDto postRequestDto) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User does not exists!"));
		
		Post oldPost = postRepository.findByIdAndAuthor(id, user).orElseThrow(() -> new RuntimeException("Post doesn't exists!"));
		Category category = categoryRepository.findById(postRequestDto.getCategoryId()).orElseThrow(() -> new RuntimeException("Category does not exists with id:" + postRequestDto.getCategoryId()));
		Set<Tag> tags = new HashSet<>(tagRepository.findAllById(postRequestDto.getTagIds()));
		
		oldPost.setTitle(postRequestDto.getTitle());
		oldPost.setContent(postRequestDto.getContent());
		oldPost.setCategory(category);
		oldPost.setReadingTime(postRequestDto.getReadingTime());
		oldPost.setStatus(postRequestDto.getStatus());
		oldPost.setCategory(category);
		oldPost.setTags(tags);
		
		Post updatedPost = postRepository.save(oldPost);
		return modelMapper.map(updatedPost, PostResponseDto.class);
	}

}
