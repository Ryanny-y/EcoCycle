package com.ecocycle.backend.farm;

import com.ecocycle.backend.farm.dto.FarmDto;
import com.ecocycle.backend.farm.model.Farm;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface FarmMapper {
    FarmDto toDto(Farm farm);
}