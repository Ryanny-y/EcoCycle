package com.ecocycle.backend.reward_activity;

import com.ecocycle.backend.reward_activity.dto.request.EarnPointsRequest;
import com.ecocycle.backend.reward_activity.dto.request.RedeemItemRequest;
import com.ecocycle.backend.reward_activity.dto.response.EarnPointsResponse;
import com.ecocycle.backend.reward_activity.dto.response.MonthlyRewardTrendResponse;
import com.ecocycle.backend.reward_activity.dto.response.RedeemItemResponse;
import com.ecocycle.backend.reward_activity.dto.response.RewardActivityStatisticResponse;

import java.util.List;
import java.util.UUID;

public interface RewardService {
    EarnPointsResponse earnPoints(UUID recordId, EarnPointsRequest earnPointsRequest);
    RedeemItemResponse redeemItem(UUID recordId, RedeemItemRequest redeemItemRequest);
    RewardActivityStatisticResponse getRewardActivityStatisticResponse();
}