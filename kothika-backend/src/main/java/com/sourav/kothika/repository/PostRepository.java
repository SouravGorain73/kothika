package com.sourav.kothika.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sourav.kothika.domain.model.Post;
import com.sourav.kothika.domain.model.PostStatus;
import com.sourav.kothika.domain.model.User;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID>{
	
	Optional<Post> findByIdAndAuthor(UUID id, User user);
	
	List<Post> findByStatus(PostStatus status);
	
	List<Post> findByAuthor_IdAndStatus(UUID userId, PostStatus status);
	
}
