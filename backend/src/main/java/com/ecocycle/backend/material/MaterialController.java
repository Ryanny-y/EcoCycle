package com.ecocycle.backend.material;

import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.material.dto.MaterialDto;
import com.ecocycle.backend.material.dto.request.CreateMaterialRequest;
import com.ecocycle.backend.material.dto.request.UpdateMaterialRequest;
import com.ecocycle.backend.material.model.Material;
import com.ecocycle.backend.security.ratelimit.RateLimit;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/materials")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;
    private final MaterialMapper materialMapper;

    @RateLimit(limit = 60, duration = 1)
    @GetMapping
    public ResponseEntity<ApiResponse<List<MaterialDto>>> getMaterials(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "order", required = false) String order
    ) {
        List<Material> materials = materialService.getMaterials(search, sortBy, order);
        List<MaterialDto> materialDtos = materials.stream().map(materialMapper::toDto).toList();

        ApiResponse<List<MaterialDto>> apiResponse = ApiResponse.<List<MaterialDto>>builder()
                .success(true)
                .message("Materials retrieved.")
                .data(materialDtos)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @RateLimit(limit = 60, duration = 1)
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MaterialDto>> getMaterial(
            @PathVariable("id") UUID id
    ) {
        Material material = materialService.getMaterialById(id);

        ApiResponse<MaterialDto> apiResponse = ApiResponse.<MaterialDto>builder()
                .success(true)
                .message("Material retrieved.")
                .data(materialMapper.toDto(material))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @RateLimit(limit = 10, duration = 1)
    @PostMapping
    public ResponseEntity<ApiResponse<MaterialDto>> createMaterial(
            @Valid @ModelAttribute CreateMaterialRequest request
    ) {
        Material createdMaterial = materialService.createMaterial(request);
        ApiResponse<MaterialDto> apiResponse = ApiResponse.<MaterialDto>builder()
                .success(true)
                .message(createdMaterial.getName() + " added!")
                .data(materialMapper.toDto(createdMaterial))
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @RateLimit(limit = 10, duration = 1)
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<MaterialDto>> updatedMaterial(
            @PathVariable("id") UUID id,
            @Valid @ModelAttribute UpdateMaterialRequest request
    ) {
        Material updatedMaterial = materialService.updateMaterial(id, request);

        ApiResponse<MaterialDto> apiResponse = ApiResponse.<MaterialDto>builder()
                .success(true)
                .message(updatedMaterial.getName() + " updated!")
                .data(materialMapper.toDto(updatedMaterial))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @RateLimit(limit = 10, duration = 1)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMaterial(
            @PathVariable("id") UUID id
    ) {
        Material deletedMaterial = materialService.deleteMaterial(id);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .message(deletedMaterial.getName() + " deleted.")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
