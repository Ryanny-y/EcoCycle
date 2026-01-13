package com.ecocycle.backend.material;

import com.ecocycle.backend.material.dto.MaterialDto;
import com.ecocycle.backend.material.model.Material;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface MaterialMapper {

    MaterialDto toDto(Material material);
}
