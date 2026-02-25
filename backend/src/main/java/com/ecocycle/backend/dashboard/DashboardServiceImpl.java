package com.ecocycle.backend.dashboard;

import com.ecocycle.backend.dashboard.dto.response.DashboardDataResponse;
import com.ecocycle.backend.dashboard.dto.response.MonthlyRecordGrowth;
import com.ecocycle.backend.exchangeitem.repository.ExchangeItemRepository;
import com.ecocycle.backend.record.model.Record;
import com.ecocycle.backend.record.repository.RecordRepository;
import com.ecocycle.backend.reward_activity.dto.response.MonthlyRewardTrendResponse;
import com.ecocycle.backend.reward_activity.model.RewardType;
import com.ecocycle.backend.reward_activity.repository.RewardActivityMaterialRepository;
import com.ecocycle.backend.reward_activity.repository.RewardActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final RecordRepository recordRepository;
    private final RewardActivityRepository rewardActivityRepository;
    private final RewardActivityMaterialRepository materialRepository;
    private final ExchangeItemRepository exchangeItemRepository;

    @Override
    public DashboardDataResponse getDashboardData(Pageable pageable) {

//        Summary Cards
        Long totalResidents = recordRepository.countByIsResidentTrue();

        BigDecimal totalMaterialsCollected =
                materialRepository.getTotalCollectedWeight();

        BigDecimal totalPointsEarned =
                rewardActivityRepository.getTotalPointsByType(RewardType.EARN);

        Long totalRewardsRedeemed =
                rewardActivityRepository.countByType(RewardType.REDEEM);

        Long lowStockItems =
                exchangeItemRepository.countLowStockItems(5);

//        Charts
        List<MonthlyRecordGrowth> recordGrowths = this.getYearlyGrowthRecord();

//        Quick Insights
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
                .monthlyRecordGrowth(recordGrowths)
                .topCollectedMaterials(materialRepository.getTop5Materials(pageable))
                .weeklyCollections(rewardActivityRepository.getWeeklyCollections(RewardType.EARN))
                .monthlyCollections(rewardActivityRepository.getMonthlyCollections(RewardType.EARN))
                .pointsEarnedThisMonth(pointsThisMonth)
                .rewardsRedeemedThisMonth(redeemedThisMonth)
                .averagePointsPerResident(avgPoints)
                .build();
    }

    private List<MonthlyRecordGrowth> getYearlyGrowthRecord() {
        LocalDateTime startOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();

        List<Record> records = recordRepository.findByCreatedAtGreaterThanEqual(startOfYear);

        Map<YearMonth, MonthlyRecordGrowth> growthMap = new TreeMap<>();

        YearMonth firstMonthOfYear = YearMonth.now().withMonth(1);

        for (int i = 0; i < 12; i++) {
            YearMonth ym = firstMonthOfYear.plusMonths(i);

            growthMap.put(ym, MonthlyRecordGrowth.builder()
                    .month(ym.toString())
                    .totalResidents(BigDecimal.ZERO)
                    .totalNonResidents(BigDecimal.ZERO)
                    .build());
        }

        for (Record record : records) {
            YearMonth ym = YearMonth.from(record.getCreatedAt());

            if (!growthMap.containsKey(ym)) continue;

            MonthlyRecordGrowth growth = growthMap.get(ym);

            if (record.getIsResident()) {
                growth.setTotalResidents(
                        growth.getTotalResidents().add(BigDecimal.ONE)
                );
            } else {
                growth.setTotalNonResidents(
                        growth.getTotalNonResidents().add(BigDecimal.ONE)
                );
            }
        }

        return new ArrayList<>(growthMap.values())
                .stream()
//                .sorted(Comparator.comparing(MonthlyRecordGrowth::getMonth))
                .toList();
    }
}
