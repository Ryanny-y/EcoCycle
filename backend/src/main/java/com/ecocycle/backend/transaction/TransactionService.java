package com.ecocycle.backend.transaction;

import com.ecocycle.backend.transaction.dto.request.EarnPointsRequest;
import com.ecocycle.backend.transaction.dto.response.EarnPointsResponse;

import java.util.UUID;

public interface TransactionService {

    EarnPointsResponse earnPoints(UUID id, EarnPointsRequest earnPointsRequest);

}
