package com.ecocycle.backend.achievement;

import com.ecocycle.backend.achievement.dto.AchievementDto;
import com.ecocycle.backend.achievement.model.Achievement;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface AchievementMapper {
    AchievementDto toDto(Achievement achievement);
}