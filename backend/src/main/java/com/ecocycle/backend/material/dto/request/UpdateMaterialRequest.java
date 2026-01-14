package com.ecocycle.backend.material.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateMaterialRequest {
    private String name;
    private String description;
    private Integer pointsPerKg;
    private MultipartFile image;
}
