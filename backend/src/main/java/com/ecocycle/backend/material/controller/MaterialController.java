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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/materials")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;
    private final MaterialMapper materialMapper;

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
