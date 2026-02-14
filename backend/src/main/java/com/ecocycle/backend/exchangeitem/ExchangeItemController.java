package com.ecocycle.backend.exchangeitem;

import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.exchangeitem.dto.ExchangeItemDto;
import com.ecocycle.backend.exchangeitem.dto.request.CreateExchangeItemRequest;
import com.ecocycle.backend.exchangeitem.dto.request.UpdateExchangeItemRequest;
import com.ecocycle.backend.exchangeitem.model.ExchangeItem;
import com.ecocycle.backend.exchangeitem.model.ItemType;
import com.ecocycle.backend.exchangeitem.model.MainCategory;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/exchange-items")
@RequiredArgsConstructor
public class ExchangeItemController {

    private final ExchangeItemService exchangeItemService;
    private final ExchangeItemMapper exchangeItemMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExchangeItemDto>>> getExchangeItems(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "mainCategory", required = false) MainCategory mainCategory,
            @RequestParam(value = "itemType", required = false) ItemType itemType
    ) {
        List<ExchangeItem> exchangeItems = exchangeItemService.getExchangeItems(search, mainCategory, itemType);
        List<ExchangeItemDto> exchangeItemDtos = exchangeItems.stream().map(exchangeItemMapper::toDto).toList();

        ApiResponse<List<ExchangeItemDto>> apiResponse = ApiResponse.<List<ExchangeItemDto>>builder()
                .success(true)
                .message("Exchange items retrieved.")
                .data(exchangeItemDtos)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExchangeItemDto>> getExchangeItem(
            @PathVariable("id") UUID id
    ) {
        ExchangeItem exchangeItem = exchangeItemService.getExchangeItemById(id);

        ApiResponse<ExchangeItemDto> apiResponse = ApiResponse.<ExchangeItemDto>builder()
                .success(true)
                .message("Exchange item retrieved.")
                .data(exchangeItemMapper.toDto(exchangeItem))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExchangeItemDto>> createExchangeItem(
            @Valid @ModelAttribute CreateExchangeItemRequest request
    ) {
        ExchangeItem createdExchangeItem = exchangeItemService.createExchangeItem(request);
        ApiResponse<ExchangeItemDto> apiResponse = ApiResponse.<ExchangeItemDto>builder()
                .success(true)
                .message(createdExchangeItem.getName() + " added!")
                .data(exchangeItemMapper.toDto(createdExchangeItem))
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<ExchangeItemDto>> updateExchangeItem(
            @PathVariable("id") UUID id,
            @Valid @ModelAttribute UpdateExchangeItemRequest request
    ) {
        ExchangeItem updatedExchangeItem = exchangeItemService.updateExchangeItem(id, request);

        ApiResponse<ExchangeItemDto> apiResponse = ApiResponse.<ExchangeItemDto>builder()
                .success(true)
                .message(updatedExchangeItem.getName() + " updated!")
                .data(exchangeItemMapper.toDto(updatedExchangeItem))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExchangeItem(
            @PathVariable("id") UUID id
    ) {
        ExchangeItem deletedExchangeItem = exchangeItemService.deleteExchangeItem(id);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .message(deletedExchangeItem.getName() + " deleted.")
                .build();

        return ResponseEntity.ok(apiResponse)   ;
    }
}