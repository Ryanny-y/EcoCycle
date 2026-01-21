package com.ecocycle.backend.official.dto.request;

import com.ecocycle.backend.common.validation.NotEmptyFile;
import com.ecocycle.backend.official.model.OfficialPosition;
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
public class CreateOfficialRequest {
    @NotBlank(message = "Full name is required.")
    private String fullName;

    @NotNull(message = "Position is required.")
    private OfficialPosition position;

    private String biography;

    @NotEmptyFile
    private MultipartFile image;
}