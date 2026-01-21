package com.ecocycle.backend.official.dto;

import com.ecocycle.backend.official.model.OfficialPosition;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OfficialDto {
    private UUID id;
    private String fullName;
    private OfficialPosition position;
    private String biography;
    private String imageUrl;
}