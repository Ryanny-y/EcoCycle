package com.ecocycle.backend.dashboard;

import com.ecocycle.backend.dashboard.dto.response.DashboardDataResponse;
import com.ecocycle.backend.exchangeitem.repository.ExchangeItemRepository;
import com.ecocycle.backend.record.repository.RecordRepository;
import com.ecocycle.backend.reward_activity.model.RewardType;
import com.ecocycle.backend.reward_activity.repository.RewardActivityMaterialRepository;
import com.ecocycle.backend.reward_activity.repository.RewardActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final RecordRepository recordRepository;
    private final RewardActivityRepository rewardActivityRepository;
    private final RewardActivityMaterialRepository materialRepository;
    private final ExchangeItemRepository exchangeItemRepository;

    @Override
    public DashboardDataResponse getDashboardData(Pageable pageable) {

        Long totalResidents = recordRepository.countByIsResidentTrue();

        BigDecimal totalMaterialsCollected =
                materialRepository.getTotalCollectedWeight();

        BigDecimal totalPointsEarned =
                rewardActivityRepository.getTotalPointsByType(RewardType.EARN);

        Long totalRewardsRedeemed =
                rewardActivityRepository.countByType(RewardType.REDEEM);

        Long lowStockItems =
                exchangeItemRepository.countLowStockItems(5);

        BigDecimal pointsThisMonth =
                rewardActivityRepository.getPointsEarnedThisMonth();

        Long redeemedThisMonth =
                rewardActivityRepository.countRedeemedThisMonth();

        BigDecimal avgPoints =
                recordRepository.getAveragePoints();

        return DashboardDataResponse.builder()
                .totalResidents(totalResidents)
                .totalMaterialsCollected(totalMaterialsCollected)
                .totalPointsEarned(totalPointsEarned)
                .totalRewardsRedeemed(totalRewardsRedeemed)
                .lowStockRewardsCount(lowStockItems)
                .topCollectedMaterials(materialRepository.getTop5Materials(pageable))
                .weeklyCollections(rewardActivityRepository.getWeeklyCollections(RewardType.EARN))
                .monthlyCollections(rewardActivityRepository.getMonthlyCollections(RewardType.EARN))
                .pointsEarnedThisMonth(pointsThisMonth)
                .rewardsRedeemedThisMonth(redeemedThisMonth)
                .averagePointsPerResident(avgPoints)
                .build();
    }
}
