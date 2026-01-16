package com.ecocycle.backend.achievement.dto.request;

import com.ecocycle.backend.common.validation.NotEmptyFile;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateAchievementRequest {
    @NotBlank(message = "Title is required.")
    private String title;

    @NotBlank(message = "Description is required.")
    private String description;

    private String link;

    @NotEmptyFile
    private MultipartFile image;
}