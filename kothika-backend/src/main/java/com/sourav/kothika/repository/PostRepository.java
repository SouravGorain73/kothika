package com.sourav.kothika.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sourav.kothika.domain.model.Post;
import com.sourav.kothika.domain.model.User;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID>{
	
	Optional<Post> findByIdAndAuthor(UUID id, User user);

}
