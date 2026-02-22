package com.ecocycle.backend.reward_activity.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MaterialInput {
    private UUID id;

    @NotNull
    @DecimalMin(value = "0.01", inclusive = true)
    private BigDecimal weight;
}