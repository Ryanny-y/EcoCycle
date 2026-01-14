package com.ecocycle.backend.material;

import com.ecocycle.backend.infrastructure.storage.FileStorageService;
import com.ecocycle.backend.material.dto.request.CreateMaterialRequest;
import com.ecocycle.backend.material.model.Material;
import com.ecocycle.backend.material.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public Material createMaterial(CreateMaterialRequest request) {
        String key = fileStorageService.uploadFile(request.getImage());

        try {
            Material material = Material.builder()
                    .name(request.getName())
                    .description(request.getDescription())
                    .pointsPerKg(request.getPointsPerKg())
                    .imageUrl(key)
                    .build();

            return materialRepository.save(material);

        } catch (RuntimeException ex) {
            fileStorageService.deleteFile(key);
            throw ex;
        }
    }


}
