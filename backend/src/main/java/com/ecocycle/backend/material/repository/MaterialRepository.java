package com.ecocycle.backend.material.repository;

import com.ecocycle.backend.material.model.Material;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MaterialRepository extends JpaRepository<Material, UUID> {
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, UUID id);

    @Query("""
           SELECT m FROM Material m
           WHERE (:search IS NULL or m.name ILIKE %:search%)
           """)
    List<Material> findAllByFilters(
            @Param("search") String search,
            Sort sort
    );
}
