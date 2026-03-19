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

import com.sourav.kothika.domain.dto.CategoryDto;
import com.sourav.kothika.domain.dto.CreateCategoryRequest;
import com.sourav.kothika.service.CategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/kothika/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class CategoryController {
	
	private final CategoryService categoryService;
	
	@GetMapping("/getAll")
	public ResponseEntity<List<CategoryDto>> listCategories(){
		List<CategoryDto> categoryList = categoryService.listCategories();
		return new ResponseEntity<List<CategoryDto>>(categoryList, HttpStatus.OK);
	}
	
	@PostMapping("/create")
	public ResponseEntity<CategoryDto> createCategory(@RequestBody @Valid CreateCategoryRequest createCategoryRequest){
		CategoryDto newCategory = categoryService.createCategory(createCategoryRequest);
		return new ResponseEntity<CategoryDto>(newCategory, HttpStatus.CREATED);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteCategory(@PathVariable UUID id){
		
		String message = categoryService.deleteCategory(id);
		return ResponseEntity.ok(message);
	}
}
