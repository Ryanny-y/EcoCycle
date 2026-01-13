package com.ecocycle.backend.material.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MaterialDto {
    private UUID id;
    private String name;
    private String description;
    private Integer pointsPerKg;
    private String imageUrl;
}
