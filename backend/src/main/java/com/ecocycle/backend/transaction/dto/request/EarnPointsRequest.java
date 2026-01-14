package com.ecocycle.backend.transaction.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EarnPointsRequest {

    @NotEmpty(message = "Materials list cannot be empty")
    @Valid
    private List<MaterialInput> materials;
}

