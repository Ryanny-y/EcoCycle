package com.ecocycle.backend.farm.dto;

import com.ecocycle.backend.farm.model.SizeUnit;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FarmSizeDto {
    @NotNull(message = "Farm size value is required")
    @Positive(message = "Farm size must be greater than zero")
    private Double value;

    @NotNull(message = "Size unit is required")
    private SizeUnit unit;
}
