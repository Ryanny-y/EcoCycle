package com.ecocycle.backend.transaction.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RedeemItemResponse {
    private BigDecimal pointsDeducted;
    private BigDecimal totalPoints;
}
