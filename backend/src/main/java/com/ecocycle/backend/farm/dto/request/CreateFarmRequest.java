package com.ecocycle.backend.farm.dto.request;

import com.ecocycle.backend.common.validation.NotEmptyFile;
import com.ecocycle.backend.farm.dto.FarmSizeDto;
import com.ecocycle.backend.farm.dto.LocationDto;
import com.ecocycle.backend.farm.model.FarmType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateFarmRequest {
    @NotBlank(message = "Farm name is required")
    @Size(max = 255, message = "Farm name must not exceed 255 characters")
    private String name;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotNull(message = "Location is required")
    @Valid
    private LocationDto location;

    @NotNull(message = "Farm size is required")
    @Valid
    private FarmSizeDto size;

    @PastOrPresent(message = "Established date cannot be in the future")
    private LocalDate establishedAt;

    @NotEmpty(message = "At least one farm type must be selected")
    @Builder.Default
    private List<FarmType> farmTypes = new ArrayList<>();

    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @NotEmptyFile
    private MultipartFile image;
}
