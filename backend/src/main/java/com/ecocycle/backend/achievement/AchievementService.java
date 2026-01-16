package com.ecocycle.backend.achievement;

import com.ecocycle.backend.achievement.dto.request.CreateAchievementRequest;
import com.ecocycle.backend.achievement.dto.request.UpdateAchievementRequest;
import com.ecocycle.backend.achievement.model.Achievement;

import java.util.List;
import java.util.UUID;

public interface AchievementService {
    List<Achievement> getAchievements();
    Achievement getAchievementById(UUID id);
    Achievement createAchievement(CreateAchievementRequest request);
    Achievement updateAchievement(UUID id, UpdateAchievementRequest request);
    Achievement deleteAchievement(UUID id);
}