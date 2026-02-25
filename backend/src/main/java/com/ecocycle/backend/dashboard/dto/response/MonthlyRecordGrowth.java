package com.ecocycle.backend.dashboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MonthlyRecordGrowth {
    private String month;
    private BigDecimal totalResidents;
    private BigDecimal totalNonResidents;
}
