package com.ecocycle.backend.farm;

import com.ecocycle.backend.farm.model.FarmSize;
import com.ecocycle.backend.farm.model.Location;
import com.ecocycle.backend.infrastructure.storage.FileStorageService;
import com.ecocycle.backend.farm.dto.request.CreateFarmRequest;
import com.ecocycle.backend.farm.dto.request.UpdateFarmRequest;
import com.ecocycle.backend.farm.exceptions.FarmAlreadyExists;
import com.ecocycle.backend.farm.exceptions.FarmNotFoundException;
import com.ecocycle.backend.farm.model.Farm;
import com.ecocycle.backend.farm.repository.FarmRepository;
import com.ecocycle.backend.infrastructure.storage.TransactionalFileDeletionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FarmServiceImpl implements FarmService {

    private final FarmRepository farmRepository;
    private final FileStorageService fileStorageService;
    private final TransactionalFileDeletionService transactionalFileDeletionService;

    @Override
    @Transactional
    public Farm createFarm(CreateFarmRequest request) {
        if (farmRepository.existsByName(request.getName())) {
            throw new FarmAlreadyExists(
                    "Farm with name: " + request.getName() + " already exists"
            );
        }

        String imageKey = fileStorageService.uploadFile(request.getImage());

        try {
            Location location = new Location(request.getLocation().getLatitude(), request.getLocation().getLongitude());
            log.info(request.getSize().getValue().toString());
            log.info(request.getSize().getUnit().name());
            FarmSize size = new FarmSize(request.getSize().getValue(), request.getSize().getUnit());

            Farm farm = Farm.builder()
                    .name(request.getName())
                    .description(request.getDescription())
                    .location(location)
                    .size(size)
                    .establishedAt(request.getEstablishedAt())
                    .farmTypes(request.getFarmTypes())
                    .address(request.getAddress())
                    .imageUrl(imageKey)
                    .build();

            return farmRepository.save(farm);

        } catch (RuntimeException ex) {
            fileStorageService.deleteFile(imageKey);
            throw ex;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Farm> getFarms() {
        return farmRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Farm getFarmById(UUID id) {
        return farmRepository.findById(id)
                .orElseThrow(() -> new FarmNotFoundException("Farm not found with ID: " + id));
    }

    @Override
    @Transactional
    public Farm updateFarm(UUID id, UpdateFarmRequest request) {
        Farm farm = getFarmById(id);

        if (request.getName() != null && !request.getName().equals(farm.getName())) {
            if (farmRepository.existsByNameAndIdNot(request.getName(), id)) {
                throw new FarmAlreadyExists(
                        "Update failed: Farm with name: " + request.getName() + " already exists"
                );
            }
            farm.setName(request.getName());
        }

        farm.setDescription(request.getDescription());

        if (request.getLocation() != null) {
            Location location = new Location(request.getLocation().getLatitude(), request.getLocation().getLongitude());
            farm.setLocation(location);
        }
        if (request.getSize() != null) {
            FarmSize size = new FarmSize(request.getSize().getValue(), request.getSize().getUnit());
            farm.setSize(size);
        }

        if (request.getEstablishedAt() != null) farm.setEstablishedAt(request.getEstablishedAt());
        if (request.getFarmTypes() != null) farm.setFarmTypes(request.getFarmTypes());
        if (request.getAddress() != null) farm.setAddress(request.getAddress());

        if (request.getImage() != null) {
            String oldImage = farm.getImageUrl();
            String newImageKey = fileStorageService.uploadFile(request.getImage());

            try {
                farm.setImageUrl(newImageKey);
                transactionalFileDeletionService.deleteAfterCommit(oldImage);
            } catch (RuntimeException ex) {
                fileStorageService.deleteFile(newImageKey);
                throw ex;
            }
        }

        return farmRepository.save(farm);
    }

    @Override
    @Transactional
    public Farm deleteFarm(UUID id) {
        Farm farm = getFarmById(id);
        String imageKey = farm.getImageUrl();

        farmRepository.delete(farm);

        transactionalFileDeletionService.deleteAfterCommit(imageKey);

        return farm;
    }
}