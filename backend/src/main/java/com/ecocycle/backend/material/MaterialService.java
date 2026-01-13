package com.ecocycle.backend.material;

import com.ecocycle.backend.material.dto.request.CreateMaterialRequest;
import com.ecocycle.backend.material.model.Material;

public interface MaterialService {

    Material createMaterial(CreateMaterialRequest request);

}
