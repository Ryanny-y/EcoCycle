package com.ecocycle.backend.reward_activity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RewardActivityStatisticResponse {
    private BigDecimal totalPointsEarned;
    private BigDecimal totalPointsRedeemed;
    private BigDecimal totalActivePoints;

    private List<MonthlyRewardTrendResponse> last6MonthsTrend;
    private List<MaterialsCollectionResponse> materialsCollection;
    private List<TopContributorResponse> topContributors;
}
