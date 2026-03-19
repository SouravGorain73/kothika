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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sourav.kothika.domain.dto.CreateTagRequest;
import com.sourav.kothika.domain.dto.TagDto;
import com.sourav.kothika.service.TagService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/kothika/tags")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class TagController {
	
	private final TagService tagService;
	
	@GetMapping("/getAll")
	public ResponseEntity<List<TagDto>> getAllTags(){
		List<TagDto> tagList = tagService.getALLTags();
		return new ResponseEntity<List<TagDto>>(tagList, HttpStatus.OK);
	}
	
	@PostMapping("/create")
	public ResponseEntity<TagDto> createTag(@RequestBody CreateTagRequest createTagRequest){
		TagDto newTag = tagService.createTag(createTagRequest);
		return new ResponseEntity<TagDto>(newTag, HttpStatus.CREATED);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteTag(@PathVariable UUID id){
		String message = tagService.deleteTag(id);
		return new ResponseEntity<String>(message, HttpStatus.OK);
	}
	
	
}
