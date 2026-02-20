package com.ecocycle.backend.reward.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class MonthlyRewardTrendResponse {
    private String month;
    private BigDecimal earnedPoints;
    private BigDecimal redeemedPoints;

}
