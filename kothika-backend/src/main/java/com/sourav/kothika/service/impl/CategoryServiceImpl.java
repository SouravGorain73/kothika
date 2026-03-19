package com.sourav.kothika.service.impl;

import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.sourav.kothika.domain.dto.CategoryDto;
import com.sourav.kothika.domain.dto.CreateCategoryRequest;
import com.sourav.kothika.domain.model.Category;
import com.sourav.kothika.repository.CategoryRepository;
import com.sourav.kothika.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService{
	
	private final CategoryRepository categoryRepository;
	private final ModelMapper modelMapper;
	
	@Override
	public List<CategoryDto> listCategories(){
		List<Category> categoryList = categoryRepository.findAllWithPostCount();
		return categoryList.stream()
				.map(category -> modelMapper.map(category, CategoryDto.class))
				.toList();
	}

	@Override
	public CategoryDto createCategory(CreateCategoryRequest createCategoryRequest) {
		Category newCategory = modelMapper.map(createCategoryRequest, Category.class);
		categoryRepository.save(newCategory);
		return modelMapper.map(newCategory, CategoryDto.class);
	}

	@Override
	public String deleteCategory(UUID id) {
		Category delCategory = categoryRepository.findById(id).orElse(null);
		if(delCategory != null) {
			if(!delCategory.getPosts().isEmpty()) {
				throw new IllegalStateException("Category has posts associated with it");
			}
			categoryRepository.delete(delCategory);
			String msg = "Category " + delCategory.getName() + " deleted successfully";
			return msg;
		}
		else {
			String msg = "Category not found with id:" + id;
			return msg;
		}
	}
}
