package com.ecocycle.backend.achievement;

import com.ecocycle.backend.achievement.dto.request.CreateAchievementRequest;
import com.ecocycle.backend.achievement.dto.request.UpdateAchievementRequest;
import com.ecocycle.backend.achievement.exceptions.AchievementAlreadyExists;
import com.ecocycle.backend.achievement.exceptions.AchievementNotFoundException;
import com.ecocycle.backend.achievement.repository.AchievementRepository;
import com.ecocycle.backend.infrastructure.storage.FileStorageService;
import com.ecocycle.backend.achievement.model.Achievement;
import com.ecocycle.backend.infrastructure.storage.TransactionalFileDeletionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AchievementServiceImpl implements AchievementService {

    private final TransactionalFileDeletionService transactionalFileDeletionService;
    private final AchievementRepository achievementsRepository;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public Achievement createAchievement(CreateAchievementRequest request) {
        if (achievementsRepository.existsByTitle(request.getTitle())) {
            throw new AchievementAlreadyExists(
                    "Achievement with title: " + request.getTitle() + " already exists"
            );
        }

        String imageKey = fileStorageService.uploadFile(request.getImage());

        try {
            Achievement achievement = Achievement.builder()
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .link(request.getLink())
                    .imageUrl(imageKey)
                    .build();

            return achievementsRepository.save(achievement);

        } catch (RuntimeException ex) {
            fileStorageService.deleteFile(imageKey);
            throw ex;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Achievement> getAchievements() {
        return achievementsRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Achievement getAchievementById(UUID id) {
        return achievementsRepository.findById(id)
                .orElseThrow(() -> new AchievementNotFoundException("Achievement not found with ID: " + id));
    }

    @Override
    @Transactional
    public Achievement updateAchievement(UUID id, UpdateAchievementRequest request) {
        Achievement achievement = getAchievementById(id);

        if (request.getTitle() != null && !request.getTitle().equals(achievement.getTitle())) {
            if (achievementsRepository.existsByTitleAndIdNot(request.getTitle(), id)) {
                throw new AchievementAlreadyExists(
                        "Update failed: Achievement with title: " + request.getTitle() + " already exists"
                );
            }
            achievement.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) achievement.setDescription(request.getDescription());
        if (request.getLink() != null) achievement.setLink(request.getLink());

        if (request.getImage() != null) {
            String oldImage = achievement.getImageUrl();
            String newImageKey = fileStorageService.uploadFile(request.getImage());

            try {
                achievement.setImageUrl(newImageKey);
                transactionalFileDeletionService.deleteAfterCommit(oldImage);
            } catch (RuntimeException ex) {
                fileStorageService.deleteFile(newImageKey);
                throw ex;
            }
        }

        return achievementsRepository.save(achievement);
    }

    @Override
    @Transactional
    public Achievement deleteAchievement(UUID id) {
        Achievement achievement = getAchievementById(id);
        String imageKey = achievement.getImageUrl();

        achievementsRepository.delete(achievement);

        transactionalFileDeletionService.deleteAfterCommit(imageKey);

        return achievement;
    }
}