package com.sourav.kothika.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sourav.kothika.domain.model.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag, UUID>{

}
