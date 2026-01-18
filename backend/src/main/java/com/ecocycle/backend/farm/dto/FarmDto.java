package com.ecocycle.backend.farm.dto;

import com.ecocycle.backend.farm.model.FarmType;
import com.ecocycle.backend.farm.model.Location;
import com.ecocycle.backend.farm.model.FarmSize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FarmDto {
    private UUID id;
    private String name;
    private String description;
    private LocationDto location;
    private FarmSizeDto size;
    private LocalDate establishedAt;
    private Set<FarmType> farmTypes;
    private String address;
    private String imageUrl;
}