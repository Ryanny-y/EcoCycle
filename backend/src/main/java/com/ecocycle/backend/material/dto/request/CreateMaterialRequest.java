package com.ecocycle.backend.material.dto.request;

import com.ecocycle.backend.common.validation.NotEmptyFile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateMaterialRequest {
    @NotBlank(message = "Name is required.")
    private String name;

    private String description;

    private Integer pointsPerKg = 1;

    @NotEmptyFile
    private MultipartFile image;
}
