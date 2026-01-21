package com.ecocycle.backend.reward;

import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.reward.dto.request.EarnPointsRequest;
import com.ecocycle.backend.reward.dto.request.RedeemItemRequest;
import com.ecocycle.backend.reward.dto.response.EarnPointsResponse;
import com.ecocycle.backend.reward.dto.response.RedeemItemResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

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
}