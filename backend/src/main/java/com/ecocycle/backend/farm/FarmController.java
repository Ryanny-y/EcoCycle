package com.ecocycle.backend.farm;

import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.farm.dto.FarmDto;
import com.ecocycle.backend.farm.dto.request.CreateFarmRequest;
import com.ecocycle.backend.farm.dto.request.UpdateFarmRequest;
import com.ecocycle.backend.farm.model.Farm;
import com.ecocycle.backend.security.ratelimit.RateLimit;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/farms")
@RequiredArgsConstructor
@Slf4j
public class FarmController {

    private final FarmService farmService;
    private final FarmMapper farmMapper;

    @RateLimit(limit = 60, duration = 1)
    @GetMapping
    public ResponseEntity<ApiResponse<List<FarmDto>>> getFarms() {
        List<Farm> farms = farmService.getFarms();
        List<FarmDto> farmDtos = farms.stream().map(farmMapper::toDto).toList();

        ApiResponse<List<FarmDto>> apiResponse = ApiResponse.<List<FarmDto>>builder()
                .success(true)
                .message("Farms retrieved.")
                .data(farmDtos)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @RateLimit(limit = 60, duration = 1)
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FarmDto>> getFarm(
            @PathVariable("id") UUID id
    ) {
        Farm farm = farmService.getFarmById(id);

        ApiResponse<FarmDto> apiResponse = ApiResponse.<FarmDto>builder()
                .success(true)
                .message("Farm retrieved.")
                .data(farmMapper.toDto(farm))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @RateLimit(limit = 10, duration = 1)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<FarmDto>> createFarm(
            @Valid @ModelAttribute CreateFarmRequest request
    ) {
        Farm createdFarm = farmService.createFarm(request);
        ApiResponse<FarmDto> apiResponse = ApiResponse.<FarmDto>builder()
                .success(true)
                .message(createdFarm.getName() + " added!")
                .data(farmMapper.toDto(createdFarm))
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @RateLimit(limit = 10, duration = 1)
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<FarmDto>> updateFarm(
            @PathVariable("id") UUID id,
            @Valid @ModelAttribute UpdateFarmRequest request
    ) {
        Farm updatedFarm = farmService.updateFarm(id, request);

        ApiResponse<FarmDto> apiResponse = ApiResponse.<FarmDto>builder()
                .success(true)
                .message(updatedFarm.getName() + " updated!")
                .data(farmMapper.toDto(updatedFarm))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @RateLimit(limit = 10, duration = 1)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFarm(
            @PathVariable("id") UUID id
    ) {
        Farm deletedFarm = farmService.deleteFarm(id);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .message(deletedFarm.getName() + " deleted.")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}