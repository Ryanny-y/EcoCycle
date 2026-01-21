package com.ecocycle.backend.reward;

import com.ecocycle.backend.reward.dto.request.EarnPointsRequest;
import com.ecocycle.backend.reward.dto.request.RedeemItemRequest;
import com.ecocycle.backend.reward.dto.response.EarnPointsResponse;
import com.ecocycle.backend.reward.dto.response.RedeemItemResponse;

import java.util.UUID;

public interface RewardService {
    EarnPointsResponse earnPoints(UUID recordId, EarnPointsRequest earnPointsRequest);
    RedeemItemResponse redeemItem(UUID recordId, RedeemItemRequest redeemItemRequest);
}