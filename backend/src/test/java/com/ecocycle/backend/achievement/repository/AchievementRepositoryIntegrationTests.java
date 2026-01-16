package com.ecocycle.backend.achievement.repository;

import com.ecocycle.backend.achievement.model.Achievement;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class AchievementRepositoryIntegrationTests {

    @Autowired
    private AchievementRepository underTest;

    private Achievement createAchievement(String title) {
        return Achievement.builder()
                .title(title)
                .description(title + " description")
                .link("https://example.com/" + title.toLowerCase().replace(" ", "-"))
                .imageUrl("fake-img.png")
                .build();
    }

    /* =========================================================
       ---------------- existsByTitle ---------------------------
       ========================================================= */

    @Test
    void existsByTitle_shouldReturnFalse_whenAchievementDoesNotExist() {
        boolean exists = underTest.existsByTitle("Eco Warrior");
        assertThat(exists).isFalse();
    }

    @Test
    void existsByTitle_shouldReturnTrue_whenAchievementExists() {
        underTest.save(createAchievement("Eco Warrior"));

        boolean exists = underTest.existsByTitle("Eco Warrior");

        assertThat(exists).isTrue();
    }

    /* =========================================================
       ---------------- existsByTitleAndIdNot -------------------
       ========================================================= */

    @Test
    void existsByTitleAndIdNot_shouldReturnTrue_whenTitleExistsForDifferentId() {
        Achievement achievement1 = createAchievement("Eco Warrior");
        Achievement achievement2 = createAchievement("Recycling Hero");

        underTest.saveAll(List.of(achievement1, achievement2));

        boolean exists = underTest.existsByTitleAndIdNot(
                "Recycling Hero",
                achievement1.getId()
        );

        assertThat(exists).isTrue();
    }

    @Test
    void existsByTitleAndIdNot_shouldReturnFalse_whenTitleDoesNotExist() {
        Achievement achievement1 = createAchievement("Eco Warrior");
        Achievement achievement2 = createAchievement("Recycling Hero");

        underTest.saveAll(List.of(achievement1, achievement2));

        boolean exists = underTest.existsByTitleAndIdNot(
                "Zero Waste Hero",
                achievement1.getId()
        );

        assertThat(exists).isFalse();
    }

    @Test
    void existsByTitleAndIdNot_shouldReturnFalse_whenSameAchievement() {
        Achievement achievement = underTest.save(createAchievement("Eco Warrior"));

        boolean exists = underTest.existsByTitleAndIdNot(
                "Eco Warrior",
                achievement.getId()
        );

        assertThat(exists).isFalse();
    }
}
