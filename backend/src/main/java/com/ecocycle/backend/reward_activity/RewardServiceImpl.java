package com.ecocycle.backend.reward_activity;

import com.ecocycle.backend.exchangeitem.ExchangeItemService;
import com.ecocycle.backend.exchangeitem.model.ExchangeItem;
import com.ecocycle.backend.material.MaterialService;
import com.ecocycle.backend.material.model.Material;
import com.ecocycle.backend.record.RecordService;
import com.ecocycle.backend.record.model.Record;
import com.ecocycle.backend.reward_activity.dto.request.EarnPointsRequest;
import com.ecocycle.backend.reward_activity.dto.request.MaterialInput;
import com.ecocycle.backend.reward_activity.dto.request.RedeemItemRequest;
import com.ecocycle.backend.reward_activity.dto.response.*;
import com.ecocycle.backend.reward_activity.exceptions.InsufficientPointsException;
import com.ecocycle.backend.reward_activity.exceptions.InsufficientStockException;
import com.ecocycle.backend.reward_activity.model.RewardActivity;
import com.ecocycle.backend.reward_activity.model.RewardActivityMaterial;
import com.ecocycle.backend.reward_activity.model.RewardType;
import com.ecocycle.backend.reward_activity.repository.RewardActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;

// TODO: Make Test for this service
@Service
@RequiredArgsConstructor
public class RewardServiceImpl implements RewardService {

    private final RecordService recordService;
    private final RewardActivityRepository rewardActivityRepository;
    private final MaterialService materialService;
    private final ExchangeItemService exchangeItemService;

    @Override
    @Transactional
    public EarnPointsResponse earnPoints(UUID recordId, EarnPointsRequest earnPointsRequest) {
        Record record = recordService.getRecordById(recordId);
        BigDecimal totalPoints = BigDecimal.ZERO;

        RewardActivity activity = RewardActivity.builder()
                .record(record)
                .type(RewardType.EARN)
                .build();

        for (MaterialInput input : earnPointsRequest.getMaterials()) {
            Material material = materialService.getMaterialById(input.getId());
            BigDecimal materialPoints = input.getWeight()
                    .multiply(BigDecimal.valueOf(material.getPointsPerKg()))
                    .setScale(2, RoundingMode.HALF_UP);

            totalPoints = totalPoints.add(materialPoints);

            activity.getMaterials().add(
                    RewardActivityMaterial.builder()
                            .activity(activity)
                            .material(material)
                            .weight(input.getWeight())
                            .points(materialPoints)
                            .build()
            );
        }

        activity.setPoints(totalPoints);
        record.setPoints(record.getPoints().add(totalPoints));
        rewardActivityRepository.save(activity);

        return EarnPointsResponse.builder()
                .pointsEarned(totalPoints)
                .totalPoints(record.getPoints())
                .build();
    }

    @Override
    @Transactional
    public RedeemItemResponse redeemItem(UUID recordId, RedeemItemRequest redeemItemRequest) {
        Record record = recordService.getRecordById(recordId);
        ExchangeItem exchangeItem = exchangeItemService.getExchangeItemById(redeemItemRequest.getExchangeItemId());

        BigDecimal totalCost = BigDecimal.valueOf(exchangeItem.getRequiredPoints())
                .multiply(BigDecimal.valueOf(redeemItemRequest.getQuantity()));

        if (exchangeItem.getStocks() < redeemItemRequest.getQuantity()) {
            throw new InsufficientStockException("Not enough stock.");
        }

        if (record.getPoints().compareTo(totalCost) < 0) {
            throw new InsufficientPointsException("Insufficient points to redeem this item.");
        }

        record.setPoints(record.getPoints().subtract(totalCost));
        exchangeItem.setStocks(exchangeItem.getStocks() - redeemItemRequest.getQuantity());

        RewardActivity redemption = RewardActivity.builder()
                .record(record)
                .type(RewardType.REDEEM)
                .points(totalCost.negate())
                .build();

        rewardActivityRepository.save(redemption);

        return RedeemItemResponse.builder()
                .pointsDeducted(totalCost)
                .totalPoints(record.getPoints())
                .build();
    }


    @Override
    public RewardActivityStatisticResponse getRewardActivityStatisticResponse() {
        BigDecimal totalPointsEarned =
                rewardActivityRepository.getTotalPointsByType(RewardType.EARN);

        BigDecimal totalPointsRedeemed =
                rewardActivityRepository.getTotalPointsByType(RewardType.REDEEM).abs();

        BigDecimal totalActivePoints = totalPointsEarned.subtract(totalPointsRedeemed);

        List<MonthlyRewardTrendResponse> last6MonthsTrend = this.getLastSixMonthsTrend();

        List<MaterialsCollectionResponse> materialsCollectionResponses = rewardActivityRepository.getMaterialsCollection();

        return RewardActivityStatisticResponse.builder()
                .totalPointsEarned(totalPointsEarned)
                .totalPointsRedeemed(totalPointsRedeemed)
                .totalActivePoints(totalActivePoints)
                .last6MonthsTrend(last6MonthsTrend)
                .materialsCollection(materialsCollectionResponses)
                .build();
    }

    private List<MonthlyRewardTrendResponse> getLastSixMonthsTrend() {

        LocalDateTime sixMonthsAgo = YearMonth.now()
                .minusMonths(5)
                .atDay(1)
                .atStartOfDay();

        List<RewardActivity> activities =
                rewardActivityRepository.findAllFromDate(sixMonthsAgo);

        Map<YearMonth, MonthlyRewardTrendResponse> trendMap = new TreeMap<>();

        for (int i = 0; i < 6; i++) {
            YearMonth ym = YearMonth.now().minusMonths(i);
            trendMap.put(ym, MonthlyRewardTrendResponse.builder()
                    .month(ym.toString())
                    .earnedPoints(BigDecimal.ZERO)
                    .redeemedPoints(BigDecimal.ZERO)
                    .build());
        }

        for (RewardActivity activity : activities) {

            YearMonth ym = YearMonth.from(activity.getCreatedAt());

            if (!trendMap.containsKey(ym)) continue;

            MonthlyRewardTrendResponse trend = trendMap.get(ym);

            if (activity.getType() == RewardType.EARN) {
                trend.setEarnedPoints(
                        trend.getEarnedPoints().add(activity.getPoints()));
            } else if (activity.getType() == RewardType.REDEEM) {
                trend.setRedeemedPoints(
                        trend.getRedeemedPoints().abs().add(activity.getPoints().abs()));
            }
        }

        return new ArrayList<>(trendMap.values())
                .stream()
                .sorted(Comparator.comparing(MonthlyRewardTrendResponse::getMonth))
                .toList();
    }

}