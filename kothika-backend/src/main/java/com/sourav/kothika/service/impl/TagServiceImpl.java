package com.sourav.kothika.service.impl;

import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.sourav.kothika.domain.dto.CreateTagRequest;
import com.sourav.kothika.domain.dto.TagDto;
import com.sourav.kothika.domain.model.Tag;
import com.sourav.kothika.repository.TagRepository;
import com.sourav.kothika.service.TagService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService{
	
	private final TagRepository tagRepository;
	private final ModelMapper modelMapper;

	@Override
	public List<TagDto> getALLTags() {
		List<Tag> tagList = tagRepository.findAll();
		return tagList.stream()
				.map(tag -> modelMapper.map(tag, TagDto.class))
				.toList();
	}

	@Override
	public TagDto createTag(CreateTagRequest createTagRequest) {
		Tag newTag = modelMapper.map(createTagRequest, Tag.class);
		tagRepository.save(newTag);
		return modelMapper.map(newTag, TagDto.class);
	}

	@Override
	public String deleteTag(UUID id) {
		Tag delTag = tagRepository.findById(id).orElse(null);
		if(delTag != null) {
			tagRepository.delete(delTag);
			String msg = "Deleted tag" + delTag.getName() + "successfully";
			return msg;
		}
		else {
			String msg = "Tag does not exist with id:" + id;
			return msg;
		}
	}

}
