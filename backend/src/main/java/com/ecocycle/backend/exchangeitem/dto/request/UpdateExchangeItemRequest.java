package com.ecocycle.backend.exchangeitem.dto.request;

import com.ecocycle.backend.exchangeitem.model.ItemType;
import com.ecocycle.backend.exchangeitem.model.MainCategory;
import com.ecocycle.backend.exchangeitem.model.Unit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateExchangeItemRequest {
    private String name;
    private String description;
    private ItemType itemType;
    private MainCategory mainCategory;
    private String subCategory;
    private Integer stocks;
    private Integer requiredPoints;
    private Unit unit;
    private String farmOrigin;
    private MultipartFile image;
}