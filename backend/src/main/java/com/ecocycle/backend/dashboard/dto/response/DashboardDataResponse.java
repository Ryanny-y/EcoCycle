package com.ecocycle.backend.dashboard.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardDataResponse {

    // === Summary Cards ===
    private Long totalResidents;
    private BigDecimal totalMaterialsCollected;
    private BigDecimal totalPointsEarned;
    private Long totalRewardsRedeemed;
    private Long lowStockRewardsCount;

    // === Charts / Insights ===
    private List<MonthlyRecordGrowth> monthlyRecordGrowth;
    private List<TopMaterialResponse> topCollectedMaterials;
    private List<WeeklyCollectionResponse> weeklyCollections;
    private List<MonthlyCollectionResponse> monthlyCollections;

    // === Monthly Stats ===
    private BigDecimal pointsEarnedThisMonth;
    private Long rewardsRedeemedThisMonth;
    private BigDecimal averagePointsPerResident;
}
