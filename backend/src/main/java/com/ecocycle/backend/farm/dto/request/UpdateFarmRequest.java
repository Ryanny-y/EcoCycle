package com.ecocycle.backend.farm.dto.request;

import com.ecocycle.backend.farm.dto.FarmSizeDto;
import com.ecocycle.backend.farm.dto.LocationDto;
import com.ecocycle.backend.farm.model.FarmType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateFarmRequest {
    private String name;
    private String description;
    private LocationDto location;
    private FarmSizeDto size;
    private LocalDate establishedAt;
    private Set<FarmType> farmTypes;
    private String address;
    private MultipartFile image;
}