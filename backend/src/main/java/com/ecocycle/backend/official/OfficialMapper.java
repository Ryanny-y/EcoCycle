package com.ecocycle.backend.official;

import com.ecocycle.backend.official.dto.OfficialDto;
import com.ecocycle.backend.official.model.Official;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface OfficialMapper {
    OfficialDto toDto(Official official);
}