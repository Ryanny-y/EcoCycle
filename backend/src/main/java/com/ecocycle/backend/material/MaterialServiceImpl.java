package com.ecocycle.backend.material;

import com.ecocycle.backend.infrastructure.storage.FileStorageService;
import com.ecocycle.backend.infrastructure.storage.TransactionalFileDeletionService;
import com.ecocycle.backend.material.dto.request.CreateMaterialRequest;
import com.ecocycle.backend.material.dto.request.UpdateMaterialRequest;
import com.ecocycle.backend.material.exceptions.MaterialAlreadyExists;
import com.ecocycle.backend.material.exceptions.MaterialNotFoundException;
import com.ecocycle.backend.material.model.Material;
import com.ecocycle.backend.material.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final TransactionalFileDeletionService transactionalFileDeletionService;
    private final MaterialRepository materialRepository;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public Material createMaterial(CreateMaterialRequest request) {

        if (materialRepository.existsByName(request.getName())) {
            throw new MaterialAlreadyExists(
                    "Material with name: " + request.getName() + " already exists"
            );
        }

        String imageKey = fileStorageService.uploadFile(request.getImage());

        try {
            Material material = Material.builder()
                    .name(request.getName())
                    .description(request.getDescription())
                    .pointsPerKg(request.getPointsPerKg())
                    .imageUrl(imageKey)
                    .build();

            return materialRepository.save(material);

        } catch (RuntimeException ex) {
            fileStorageService.deleteFile(imageKey);
            throw ex;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Material> getMaterials(String search, String sortBy, String order) {
        Sort.Direction direction = Sort.Direction.fromString(order);
        Sort sort = Sort.by(direction, sortBy);

        return materialRepository.findAllByFilters(search, sort);
    }

    @Override
    @Transactional(readOnly = true)
    public Material getMaterialById(UUID id) {
        return materialRepository.findById(id)
                .orElseThrow(() -> new MaterialNotFoundException("Material not found with ID: " + id));
    }

    @Override
    @Transactional
    public Material updateMaterial(UUID id, UpdateMaterialRequest request) {
        Material material = getMaterialById(id);

        if(request.getName() != null && !request.getName().equals(material.getName())) {
            if (materialRepository.existsByNameAndIdNot(request.getName(), id)) {
                throw new MaterialAlreadyExists("Update failed: Material with name: " + request.getName() + " already exists");
            }

            material.setName(request.getName());
        }

        if(request.getDescription() != null) material.setDescription(request.getDescription());

        if(request.getPointsPerKg() != null) material.setPointsPerKg(request.getPointsPerKg());

        if(request.getImage() != null) {
            String oldImage = material.getImageUrl();
            String newImageKey = fileStorageService.uploadFile(request.getImage());

            try {
                material.setImageUrl(newImageKey);
                transactionalFileDeletionService.deleteAfterCommit((oldImage));
            } catch (RuntimeException ex) {
                fileStorageService.deleteFile(newImageKey);
                throw ex;
            }
        }

        return materialRepository.save(material);
    }

    @Override
    @Transactional
    public Material deleteMaterial(UUID id) {

        Material material = getMaterialById(id);
        String imageKey = material.getImageUrl();

        materialRepository.delete(material);

        transactionalFileDeletionService.deleteAfterCommit(imageKey);

        return material;
    }

}
