package com.ecocycle.backend.official.repository;

import com.ecocycle.backend.official.model.Official;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OfficialRepository extends JpaRepository<Official, UUID> {
    boolean existsByFullName(String fullName);
    boolean existsByFullNameAndIdNot(String fullName, UUID id);
}