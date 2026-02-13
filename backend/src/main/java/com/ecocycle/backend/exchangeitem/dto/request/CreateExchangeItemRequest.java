package com.ecocycle.backend.exchangeitem.dto.request;

import com.ecocycle.backend.common.validation.NotEmptyFile;
import com.ecocycle.backend.exchangeitem.model.ItemType;
import com.ecocycle.backend.exchangeitem.model.MainCategory;
import com.ecocycle.backend.exchangeitem.model.Unit;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateExchangeItemRequest {
    @NotBlank(message = "Name is required.")
    private String name;

    private String description;

    @NotNull(message = "Item type is required.")
    private ItemType itemType;

    @NotNull(message = "Main category is required.")
    private MainCategory mainCategory;

    private String subCategory;

    @Builder.Default
    private Integer stocks = 0;

    private Integer requiredPoints;

    @NotNull(message = "Unit is required.")
    private Unit unit;

    private String farmOrigin;

    @NotEmptyFile
    private MultipartFile image;
}