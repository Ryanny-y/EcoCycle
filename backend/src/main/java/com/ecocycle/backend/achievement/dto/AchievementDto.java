package com.ecocycle.backend.achievement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AchievementDto {
    private UUID id;
    private String title;
    private String description;
    private String link;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}