package com.ecocycle.backend.achievement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateAchievementRequest {
    private String title;
    private String description;
    private String link;
    private MultipartFile image;
}