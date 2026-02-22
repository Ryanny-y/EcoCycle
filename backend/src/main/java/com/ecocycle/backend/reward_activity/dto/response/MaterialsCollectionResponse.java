package com.ecocycle.backend.reward_activity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MaterialsCollectionResponse {

    private String materialName;
    private BigDecimal totalWeight;

}
