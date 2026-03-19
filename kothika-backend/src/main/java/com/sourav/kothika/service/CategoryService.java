package com.sourav.kothika.service;

import java.util.List;
import java.util.UUID;

import com.sourav.kothika.domain.dto.CategoryDto;
import com.sourav.kothika.domain.dto.CreateCategoryRequest;


public interface CategoryService {
	
	public List<CategoryDto> listCategories();
	public CategoryDto createCategory(CreateCategoryRequest createCategoryRequest);
	public String deleteCategory(UUID id);
}
