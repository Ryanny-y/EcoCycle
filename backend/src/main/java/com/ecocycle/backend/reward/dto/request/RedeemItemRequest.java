package com.ecocycle.backend.reward.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RedeemItemRequest {
    @NotNull(message = "Exchange item ID is required.")
    private UUID exchangeItemId;

    @Positive(message = "Quantity must be greater than 0.")
    private Integer quantity;
}