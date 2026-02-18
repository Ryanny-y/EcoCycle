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
public class WeeklyCollectionResponse {
    private String weekLabel; // e.g., "Week 1"
    private BigDecimal totalCollected;
}