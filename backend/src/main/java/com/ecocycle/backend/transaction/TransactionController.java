package com.ecocycle.backend.transaction;

import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.transaction.dto.request.EarnPointsRequest;
import com.ecocycle.backend.transaction.dto.request.RedeemItemRequest;
import com.ecocycle.backend.transaction.dto.response.EarnPointsResponse;
import com.ecocycle.backend.transaction.dto.response.RedeemItemResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/earn/{recordId}")
    public ResponseEntity<ApiResponse<EarnPointsResponse>> earnPoints(
            @PathVariable("recordId") UUID recordId,
            @Valid @RequestBody EarnPointsRequest earnPointsRequest
    ) {
        EarnPointsResponse response = transactionService.earnPoints(recordId, earnPointsRequest);

        ApiResponse<EarnPointsResponse> apiResponse = ApiResponse.<EarnPointsResponse>builder()
                .success(true)
                .message("Earn points successful.")
                .data(response)
                .build();

        return ResponseEntity.ok(apiResponse);
    }
//
//    @PostMapping("/redeem/{recordId}")
//    public ResponseEntity<ApiResponse<RedeemItemResponse>> redeemItem(
//            @PathVariable("recordId") UUID id,
//            @Valid @RequestBody RedeemItemRequest redeemItemRequest
//    ) {
//
//    }

}
