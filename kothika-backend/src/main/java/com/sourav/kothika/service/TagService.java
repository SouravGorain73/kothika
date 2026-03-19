package com.sourav.kothika.service;

import java.util.List;
import java.util.UUID;

import com.sourav.kothika.domain.dto.CreateTagRequest;
import com.sourav.kothika.domain.dto.TagDto;

public interface TagService {

	List<TagDto> getALLTags();

	TagDto createTag(CreateTagRequest createTagRequest);

	String deleteTag(UUID id);

}
