package com.ecocycle.backend.record;

import com.ecocycle.backend.record.dto.RecordDto;
import com.ecocycle.backend.record.model.Record;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface RecordMapper {

    RecordDto toDto(Record record);

}
