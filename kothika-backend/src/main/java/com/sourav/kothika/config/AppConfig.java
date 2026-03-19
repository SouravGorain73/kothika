package com.sourav.kothika.config;

import java.util.Collection;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.sourav.kothika.domain.dto.CategoryDto;
import com.sourav.kothika.domain.dto.TagDto;
import com.sourav.kothika.domain.model.Category;
import com.sourav.kothika.domain.model.Post;
import com.sourav.kothika.domain.model.PostStatus;
import com.sourav.kothika.domain.model.Tag;

@Configuration
public class AppConfig {
	
	@Bean
	public ModelMapper getModelMapper() {

		ModelMapper modelMapper = new ModelMapper();

        Converter<Collection<Post>, Long> postCountConverter = context -> {
            Collection<Post> posts = context.getSource();

            if (posts == null) {
                return 0L;
            }

            return posts.stream()
                    .filter(post -> PostStatus.PUBLISHED.equals(post.getStatus()))
                    .count();
        };
        
        Converter<Collection<Post>, Long> tagPostCount = context -> {
            Collection<Post> posts = context.getSource();

            if (posts == null) return 0L;

            return posts.stream()
                    .filter(post -> PostStatus.PUBLISHED.equals(post.getStatus()))
                    .count();
        };

        modelMapper.typeMap(Category.class, CategoryDto.class)
                .addMappings(mapper ->
                        mapper.using(postCountConverter)
                              .map(Category::getPosts, CategoryDto::setPostCount)
                );
        
        modelMapper.typeMap(Tag.class, TagDto.class)
        .addMappings(mapper ->
                mapper.using(tagPostCount)
                      .map(Tag::getPosts, TagDto::setPostCount)
        );

        return modelMapper;
	}
}
