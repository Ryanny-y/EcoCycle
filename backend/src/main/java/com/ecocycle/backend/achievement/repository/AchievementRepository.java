package com.ecocycle.backend.achievement.repository;

import com.ecocycle.backend.achievement.model.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, UUID> {
    boolean existsByTitle(String title);
    boolean existsByTitleAndIdNot(String title, UUID id);
}