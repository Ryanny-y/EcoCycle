package com.ecocycle.backend.exchangeitem;

import com.ecocycle.backend.exchangeitem.dto.ExchangeItemDto;
import com.ecocycle.backend.exchangeitem.model.ExchangeItem;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface ExchangeItemMapper {
    ExchangeItemDto toDto(ExchangeItem exchangeItem);
}