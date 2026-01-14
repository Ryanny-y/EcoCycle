package com.ecocycle.backend.material;

import com.ecocycle.backend.material.dto.request.CreateMaterialRequest;
import com.ecocycle.backend.material.dto.request.UpdateMaterialRequest;
import com.ecocycle.backend.material.model.Material;

import java.util.List;
import java.util.UUID;

public interface MaterialService {

    Material createMaterial(CreateMaterialRequest request);
    List<Material> getMaterials();
    Material getMaterialById(UUID id);
    Material updateMaterial(UUID id, UpdateMaterialRequest request);
}
