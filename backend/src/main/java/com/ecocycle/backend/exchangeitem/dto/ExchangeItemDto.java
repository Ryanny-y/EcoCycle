package com.ecocycle.backend.exchangeitem.dto;

import com.ecocycle.backend.exchangeitem.model.ItemType;
import com.ecocycle.backend.exchangeitem.model.MainCategory;
import com.ecocycle.backend.exchangeitem.model.Unit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExchangeItemDto {
    private UUID id;
    private String name;
    private String description;
    private ItemType itemType;
    private MainCategory mainCategory;
    private String subCategory;
    private Integer stocks;
    private Integer requiredPoints;
    private Unit unit;
    private String farmOrigin;
    private LocalDateTime lastRestocked;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}