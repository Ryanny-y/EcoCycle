package com.ecocycle.backend.reward_activity;

import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.reward_activity.dto.request.EarnPointsRequest;
import com.ecocycle.backend.reward_activity.dto.request.RedeemItemRequest;
import com.ecocycle.backend.reward_activity.dto.response.EarnPointsResponse;
import com.ecocycle.backend.reward_activity.dto.response.MonthlyRewardTrendResponse;
import com.ecocycle.backend.reward_activity.dto.response.RedeemItemResponse;
import com.ecocycle.backend.reward_activity.dto.response.RewardActivityStatisticResponse;
import com.ecocycle.backend.security.ratelimit.RateLimit;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    @RateLimit(limit = 5, duration = 1)
    @PostMapping("/earn/{recordId}")
    public ResponseEntity<ApiResponse<EarnPointsResponse>> earnPoints(
            @PathVariable("recordId") UUID recordId,
            @Valid @RequestBody EarnPointsRequest earnPointsRequest
    ) {
        EarnPointsResponse response = rewardService.earnPoints(recordId, earnPointsRequest);

        ApiResponse<EarnPointsResponse> apiResponse = ApiResponse.<EarnPointsResponse>builder()
                .success(true)
                .message("Points earned successfully.")
                .data(response)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @RateLimit(limit = 5, duration = 1)
    @PostMapping("/redeem/{recordId}")
    public ResponseEntity<ApiResponse<RedeemItemResponse>> redeemItem(
            @PathVariable("recordId") UUID recordId,
            @Valid @RequestBody RedeemItemRequest redeemItemRequest
    ) {
        RedeemItemResponse response = rewardService.redeemItem(recordId, redeemItemRequest);

        ApiResponse<RedeemItemResponse> apiResponse = ApiResponse.<RedeemItemResponse>builder()
                .success(true)
                .message("Item redeemed successfully.")
                .data(response)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @RateLimit(limit = 60, duration = 1)
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<RewardActivityStatisticResponse>> getRewardActivityStatisticResponse() {

        RewardActivityStatisticResponse response = rewardService.getRewardActivityStatisticResponse();

        ApiResponse<RewardActivityStatisticResponse> apiResponse =
                ApiResponse.<RewardActivityStatisticResponse>builder()
                        .success(true)
                        .message("Last 6 months reward trend retrieved successfully.")
                        .data(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

}