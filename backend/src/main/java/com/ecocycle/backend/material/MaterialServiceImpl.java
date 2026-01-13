package com.ecocycle.backend.material;

import com.ecocycle.backend.infrastructure.storage.s3.service.FileStorageService;
import com.ecocycle.backend.material.dto.request.CreateMaterialRequest;
import com.ecocycle.backend.material.model.Material;
import com.ecocycle.backend.material.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;
    private final FileStorageService fileStorageService;

    @Override
    public Material createMaterial(CreateMaterialRequest request) {
        String key = fileStorageService.uploadFile(request.getImage());

        Material material = Material.builder()
                .name(request.getName())
                .description(request.getDescription())
                .pointsPerKg(request.getPointsPerKg())
                .imageUrl(key)
                .build();

        return materialRepository.save(material);
    }
}
