package com.ecocycle.backend.farm;

import com.ecocycle.backend.farm.dto.request.CreateFarmRequest;
import com.ecocycle.backend.farm.dto.request.UpdateFarmRequest;
import com.ecocycle.backend.farm.model.Farm;

import java.util.List;
import java.util.UUID;

public interface FarmService {
    List<Farm> getFarms();
    Farm getFarmById(UUID id);
    Farm createFarm(CreateFarmRequest request);
    Farm updateFarm(UUID id, UpdateFarmRequest request);
    Farm deleteFarm(UUID id);
}