package com.ecocycle.backend.achievement;


import com.ecocycle.backend.achievement.dto.request.CreateAchievementRequest;
import com.ecocycle.backend.achievement.dto.request.UpdateAchievementRequest;
import com.ecocycle.backend.achievement.exceptions.AchievementAlreadyExists;
import com.ecocycle.backend.achievement.exceptions.AchievementNotFoundException;
import com.ecocycle.backend.achievement.model.Achievement;
import com.ecocycle.backend.achievement.repository.AchievementRepository;
import com.ecocycle.backend.infrastructure.storage.FileStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.transaction.TestTransaction;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@Transactional
class AchievementServiceIntegrationTest {

    @Autowired
    private AchievementService underTest;

    @MockitoBean
    private FileStorageService fileStorageService;

    @Autowired
    private AchievementRepository AchievementRepository;

    /* =======================
       Setup and Helpers
     ======================= */

    @BeforeEach
    void setUp() {
        // Clear database before each test
        AchievementRepository.deleteAll();
    }

    private CreateAchievementRequest createAchievement(String title) {
        return CreateAchievementRequest.builder()
                .title(title)
                .description(title + " description")
                .link("https://example.com/" + title.toLowerCase().replace(" ", "-"))
                .image(new MockMultipartFile(
                        "image",
                        title + ".png",
                        "image/png",
                        "fake-content".getBytes()
                ))
                .build();
    }

    /* =========================================================
       ---------------- CREATE ACHIEVEMENT ----------------------
       ========================================================= */

    @Test
    void createAchievement_shouldCreateAchievementSuccessfully() {
        when(fileStorageService.uploadFile(any())).thenReturn("image-key.jpg");

        Achievement achievement = underTest.createAchievement(createAchievement("Eco Warrior"));

        assertThat(achievement).isNotNull();
        assertThat(achievement.getTitle()).isEqualTo("Eco Warrior");
        assertThat(achievement.getDescription()).isEqualTo("Eco Warrior description");
        assertThat(achievement.getLink()).isEqualTo("https://example.com/eco-warrior");
        assertThat(achievement.getImageUrl()).isEqualTo("image-key.jpg");
    }

    @Test
    void createAchievement_shouldThrow_whenAchievementAlreadyExists() {
        when(fileStorageService.uploadFile(any())).thenReturn("image1.jpg");

        underTest.createAchievement(createAchievement("Eco Warrior"));

        assertThatThrownBy(() ->
                underTest.createAchievement(createAchievement("Eco Warrior"))
        ).isInstanceOf(AchievementAlreadyExists.class)
                .hasMessageContaining("already exists");
    }

    /* =========================================================
       ---------------- GET Achievement ------------------------
       ========================================================= */

    @Test
    void getAchievement_shouldReturnAllAchievement() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("img1.jpg")
                .thenReturn("img2.jpg");

        underTest.createAchievement(createAchievement("Eco Warrior"));
        underTest.createAchievement(createAchievement("Recycling Hero"));

        List<Achievement> achievements = underTest.getAchievements();

        assertThat(achievements).hasSize(2);
        assertThat(achievements)
                .extracting(Achievement::getTitle)
                .containsExactlyInAnyOrder("Eco Warrior", "Recycling Hero");
    }

    @Test
    void getAchievement_shouldReturnEmptyList_whenNoAchievement() {
        List<Achievement> Achievement = underTest.getAchievements();

        assertThat(Achievement).isEmpty();
    }

    /* =========================================================
       ---------------- GET ACHIEVEMENT BY ID -------------------
       ========================================================= */

    @Test
    void getAchievementById_shouldReturnAchievement() {
        when(fileStorageService.uploadFile(any())).thenReturn("img.jpg");

        Achievement achievement = underTest.createAchievement(createAchievement("Eco Warrior"));

        Achievement found = underTest.getAchievementById(achievement.getId());

        assertThat(found.getId()).isEqualTo(achievement.getId());
        assertThat(found.getTitle()).isEqualTo("Eco Warrior");
    }

    @Test
    void getAchievementById_shouldThrow_whenNotFound() {
        assertThatThrownBy(() ->
                underTest.getAchievementById(UUID.randomUUID())
        ).isInstanceOf(AchievementNotFoundException.class)
                .hasMessageContaining("not found");
    }

    /* =========================================================
       ---------------- UPDATE ACHIEVEMENT ----------------------
       ========================================================= */

    @Test
    void updateAchievement_shouldUpdateFieldsSuccessfully() {
        when(fileStorageService.uploadFile(any())).thenReturn("img.jpg");

        Achievement achievement = underTest.createAchievement(createAchievement("Eco Warrior"));

        UpdateAchievementRequest update = UpdateAchievementRequest.builder()
                .title("Eco Champion")
                .description("Updated description")
                .link("https://example.com/updated-link")
                .build();

        Achievement updated = underTest.updateAchievement(achievement.getId(), update);

        assertThat(updated.getTitle()).isEqualTo("Eco Champion");
        assertThat(updated.getDescription()).isEqualTo("Updated description");
        assertThat(updated.getLink()).isEqualTo("https://example.com/updated-link");
    }

    @Test
    void updateAchievement_shouldUpdateOnlyProvidedFields() {
        when(fileStorageService.uploadFile(any())).thenReturn("img.jpg");

        Achievement achievement = underTest.createAchievement(createAchievement("Eco Warrior"));
        String originalLink = achievement.getLink();

        // Only update title, keep other fields unchanged
        UpdateAchievementRequest update = UpdateAchievementRequest.builder()
                .title("Eco Champion")
                .build();

        Achievement updated = underTest.updateAchievement(achievement.getId(), update);

        assertThat(updated.getTitle()).isEqualTo("Eco Champion");
        assertThat(updated.getDescription()).isEqualTo(achievement.getDescription());
        assertThat(updated.getLink()).isEqualTo(originalLink);
        assertThat(updated.getImageUrl()).isEqualTo(achievement.getImageUrl());
    }

    @Test
    void updateAchievement_shouldReplaceImage_andDeleteOldAfterCommit() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("old-image.jpg")
                .thenReturn("new-image.jpg");

        Achievement achievement = underTest.createAchievement(createAchievement("Eco Warrior"));

        UpdateAchievementRequest update = UpdateAchievementRequest.builder()
                .image(new MockMultipartFile(
                        "image",
                        "new.png",
                        "image/png",
                        "new-content".getBytes()
                ))
                .build();

        Achievement updated = underTest.updateAchievement(achievement.getId(), update);

        assertThat(updated.getImageUrl()).isEqualTo("new-image.jpg");

        // Commit transaction to trigger file deletion
        TestTransaction.flagForCommit();
        TestTransaction.end();
        TestTransaction.start();

        verify(fileStorageService).deleteFile("old-image.jpg");
    }

    @Test
    void updateAchievement_shouldNotUpdateImage_whenNoImageProvided() {
        when(fileStorageService.uploadFile(any())).thenReturn("original-image.jpg");

        Achievement achievement = underTest.createAchievement(createAchievement("Eco Warrior"));

        UpdateAchievementRequest update = UpdateAchievementRequest.builder()
                .title("Updated Title")
                .build();

        Achievement updated = underTest.updateAchievement(achievement.getId(), update);

        assertThat(updated.getTitle()).isEqualTo("Updated Title");
        assertThat(updated.getImageUrl()).isEqualTo("original-image.jpg");
        verify(fileStorageService, times(1)).uploadFile(any()); // Only during creation
    }

    /* =========================================================
       ---------------- DELETE ACHIEVEMENT ----------------------
       ========================================================= */

    @Test
    void deleteAchievement_shouldDeleteAchievement_andDeleteImageAfterCommit() {
        when(fileStorageService.uploadFile(any())).thenReturn("delete-image.jpg");

        Achievement achievement = underTest.createAchievement(createAchievement("Eco Warrior"));

        underTest.deleteAchievement(achievement.getId());

        // Commit transaction to trigger file deletion
        TestTransaction.flagForCommit();
        TestTransaction.end();
        TestTransaction.start();

        verify(fileStorageService).deleteFile("delete-image.jpg");

        assertThatThrownBy(() ->
                underTest.getAchievementById(achievement.getId())
        ).isInstanceOf(AchievementNotFoundException.class);
    }

    /* =========================================================
       ---------------- EDGE CASES ------------------------------
       ========================================================= */

    @Test
    void updateAchievement_shouldThrow_whenUpdatingToExistingTitle() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("img1.jpg")
                .thenReturn("img2.jpg");

        underTest.createAchievement(createAchievement("Eco Warrior"));
        Achievement secondAchievement = underTest.createAchievement(createAchievement("Recycling Hero"));

        UpdateAchievementRequest update = UpdateAchievementRequest.builder()
                .title("Eco Warrior")
                .build();

        assertThatThrownBy(() ->
                underTest.updateAchievement(secondAchievement.getId(), update)
        ).isInstanceOf(AchievementAlreadyExists.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void updateAchievement_shouldNotThrow_whenKeepingSameTitle() {
        when(fileStorageService.uploadFile(any())).thenReturn("img.jpg");

        Achievement achievement = underTest.createAchievement(createAchievement("Eco Warrior"));

        UpdateAchievementRequest update = UpdateAchievementRequest.builder()
                .title("Eco Warrior") // Same title
                .description("Updated description")
                .build();

        Achievement updated = underTest.updateAchievement(achievement.getId(), update);

        assertThat(updated.getTitle()).isEqualTo("Eco Warrior");
        assertThat(updated.getDescription()).isEqualTo("Updated description");
    }

    @Test
    void deleteAchievement_shouldThrow_whenAchievementDoesNotExist() {
        assertThatThrownBy(() ->
                underTest.deleteAchievement(UUID.randomUUID())
        ).isInstanceOf(AchievementNotFoundException.class)
                .hasMessageContaining("not found");
    }

    @Test
    void updateAchievement_shouldThrow_whenAchievementDoesNotExist() {
        UpdateAchievementRequest update = UpdateAchievementRequest.builder()
                .title("Nonexistent")
                .build();

        assertThatThrownBy(() ->
                underTest.updateAchievement(UUID.randomUUID(), update)
        ).isInstanceOf(AchievementNotFoundException.class)
                .hasMessageContaining("not found");
    }

    @Test
    void createAchievement_shouldFailBeforeFileUpload_whenTitleAlreadyExists() {
        // First create an achievement
        when(fileStorageService.uploadFile(any())).thenReturn("img1.jpg");
        underTest.createAchievement(createAchievement("Eco Warrior"));

        assertThatThrownBy(() ->
                underTest.createAchievement(createAchievement("Eco Warrior"))
        ).isInstanceOf(AchievementAlreadyExists.class);

        verify(fileStorageService, times(1)).uploadFile(any());
        verify(fileStorageService, never()).deleteFile(any());
    }

    @Test
    void updateAchievement_shouldNotUploadFile_whenTitleAlreadyExists() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("img1.jpg")
                .thenReturn("img2.jpg");

        underTest.createAchievement(createAchievement("Eco Warrior"));
        Achievement secondAchievement = underTest.createAchievement(createAchievement("Recycling Hero"));

        // Try to update second achievement with first achievement's title (will fail)
        UpdateAchievementRequest update = UpdateAchievementRequest.builder()
                .title("Eco Warrior") // Already exists
                .image(new MockMultipartFile("new-image", "new.png", "image/png", "content".getBytes()))
                .build();

        assertThatThrownBy(() ->
                underTest.updateAchievement(secondAchievement.getId(), update)
        ).isInstanceOf(AchievementAlreadyExists.class);

        // Verify the uploaded file was deleted after rollback
        verify(fileStorageService, times(2)).uploadFile(any());
        verify(fileStorageService, never()).deleteFile("new-image-key.jpg");
    }
}