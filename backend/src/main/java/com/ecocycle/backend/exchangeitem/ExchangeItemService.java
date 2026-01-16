package com.ecocycle.backend.exchangeitem;

import com.ecocycle.backend.exchangeitem.dto.request.CreateExchangeItemRequest;
import com.ecocycle.backend.exchangeitem.dto.request.UpdateExchangeItemRequest;
import com.ecocycle.backend.exchangeitem.model.ExchangeItem;

import java.util.List;
import java.util.UUID;

public interface ExchangeItemService {
    List<ExchangeItem> getExchangeItems();
    ExchangeItem getExchangeItemById(UUID id);
    ExchangeItem createExchangeItem(CreateExchangeItemRequest request);
    ExchangeItem updateExchangeItem(UUID id, UpdateExchangeItemRequest request);
    ExchangeItem deleteExchangeItem(UUID id);
}