package com.ecocycle.backend.achievement;

import com.ecocycle.backend.achievement.dto.AchievementDto;
import com.ecocycle.backend.achievement.dto.request.CreateAchievementRequest;
import com.ecocycle.backend.achievement.dto.request.UpdateAchievementRequest;
import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.achievement.model.Achievement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/achievements")
@RequiredArgsConstructor
public class AchievementController {

    private final AchievementService achievementsService;
    private final AchievementMapper achievementsMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AchievementDto>>> getAchievements() {
        List<Achievement> achievements = achievementsService.getAchievements();
        List<AchievementDto> AchievementDtos = achievements.stream().map(achievementsMapper::toDto).toList();

        ApiResponse<List<AchievementDto>> apiResponse = ApiResponse.<List<AchievementDto>>builder()
                .success(true)
                .message("Achievements retrieved.")
                .data(AchievementDtos)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AchievementDto>> getAchievement(
            @PathVariable("id") UUID id
    ) {
        Achievement achievement = achievementsService.getAchievementById(id);

        ApiResponse<AchievementDto> apiResponse = ApiResponse.<AchievementDto>builder()
                .success(true)
                .message("Achievement retrieved.")
                .data(achievementsMapper.toDto(achievement))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AchievementDto>> createAchievement(
            @Valid @ModelAttribute CreateAchievementRequest request
    ) {
        Achievement createdAchievement = achievementsService.createAchievement(request);
        ApiResponse<AchievementDto> apiResponse = ApiResponse.<AchievementDto>builder()
                .success(true)
                .message(createdAchievement.getTitle() + " added!")
                .data(achievementsMapper.toDto(createdAchievement))
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<AchievementDto>> updateAchievement(
            @PathVariable("id") UUID id,
            @Valid @ModelAttribute UpdateAchievementRequest request
    ) {
        Achievement updatedAchievement = achievementsService.updateAchievement(id, request);

        ApiResponse<AchievementDto> apiResponse = ApiResponse.<AchievementDto>builder()
                .success(true)
                .message(updatedAchievement.getTitle() + " updated!")
                .data(achievementsMapper.toDto(updatedAchievement))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAchievement(
            @PathVariable("id") UUID id
    ) {
        Achievement deletedAchievement = achievementsService.deleteAchievement(id);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .message(deletedAchievement.getTitle() + " deleted.")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}