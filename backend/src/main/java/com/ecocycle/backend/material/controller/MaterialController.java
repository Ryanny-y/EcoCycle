package com.ecocycle.backend.material.controller;

import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.material.MaterialMapper;
import com.ecocycle.backend.material.MaterialService;
import com.ecocycle.backend.material.dto.MaterialDto;
import com.ecocycle.backend.material.dto.request.CreateMaterialRequest;
import com.ecocycle.backend.material.model.Material;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/materials")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;
    private final MaterialMapper materialMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MaterialDto>>> getMaterials() {
        List<Material> materials = materialService.getMaterials();
        List<MaterialDto> materialDtos = materials.stream().map(materialMapper::toDto).toList();

        ApiResponse<List<MaterialDto>> apiResponse = ApiResponse.<List<MaterialDto>>builder()
                .success(true)
                .message("Materials retrieved.")
                .data(materialDtos)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

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

}
