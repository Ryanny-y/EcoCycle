package com.ecocycle.backend.transaction.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RedeemItemRequest {

    @NotNull(message = "exchange item ID is required.")
    private UUID exchangeItemId;

    @Positive(message = "Quantity must be greater than 1.")
    private Integer quantity;

}
