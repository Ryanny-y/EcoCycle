package com.ecocycle.backend.official;

import com.ecocycle.backend.infrastructure.storage.FileStorageService;
import com.ecocycle.backend.infrastructure.storage.TransactionalFileDeletionService;
import com.ecocycle.backend.official.dto.request.CreateOfficialRequest;
import com.ecocycle.backend.official.dto.request.UpdateOfficialRequest;
import com.ecocycle.backend.official.exceptions.OfficialAlreadyExistsException;
import com.ecocycle.backend.official.exceptions.OfficialNotFoundException;
import com.ecocycle.backend.official.model.Official;
import com.ecocycle.backend.official.model.OfficialPosition;
import com.ecocycle.backend.official.repository.OfficialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

// TODO: Make Test for this service
@Service
@RequiredArgsConstructor
public class OfficialServiceImpl implements OfficialService {

    private final OfficialRepository officialRepository;
    private final FileStorageService fileStorageService;
    private final TransactionalFileDeletionService transactionalFileDeletionService;

    @Override
    @Transactional(readOnly = true)
    public List<Official> getOfficials() {
        return officialRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Official getOfficialById(UUID id) {
        return officialRepository.findById(id)
                .orElseThrow(() -> new OfficialNotFoundException("Official not found with ID: " + id));
    }

    @Override
    @Transactional
    public Official createOfficial(CreateOfficialRequest request) {
        if (officialRepository.existsByFullName(request.getFullName())) {
            throw new OfficialAlreadyExistsException(
                    "Official with full name: " + request.getFullName() + " already exists"
            );
        }

        String imageKey = fileStorageService.uploadFile(request.getImage());

        try {
            Official official = Official.builder()
                    .fullName(request.getFullName())
                    .position(request.getPosition())
                    .biography(request.getBiography())
                    .imageUrl(imageKey)
                    .build();

            return officialRepository.save(official);

        } catch (RuntimeException ex) {
            fileStorageService.deleteFile(imageKey);
            throw ex;
        }
    }

    @Override
    @Transactional
    public Official updateOfficial(UUID id, UpdateOfficialRequest request) {
        Official official = getOfficialById(id);

        if (request.getFullName() != null && !request.getFullName().equals(official.getFullName())) {
            if (officialRepository.existsByFullNameAndIdNot(request.getFullName(), id)) {
                throw new OfficialAlreadyExistsException(
                        "Update failed: Official with full name: " + request.getFullName() + " already exists"
                );
            }
            official.setFullName(request.getFullName());
        }

        if (request.getPosition() != null) {
            official.setPosition(request.getPosition());
        }

        if (request.getBiography() != null) {
            official.setBiography(request.getBiography());
        }

        if (request.getImage() != null) {
            String oldImage = official.getImageUrl();
            String newImageKey = fileStorageService.uploadFile(request.getImage());

            try {
                official.setImageUrl(newImageKey);
                transactionalFileDeletionService.deleteAfterCommit(oldImage);
            } catch (RuntimeException ex) {
                fileStorageService.deleteFile(newImageKey);
                throw ex;
            }
        }

        return officialRepository.save(official);
    }

    @Override
    @Transactional
    public Official deleteOfficial(UUID id) {
        Official official = getOfficialById(id);
        String imageKey = official.getImageUrl();

        officialRepository.delete(official);
        transactionalFileDeletionService.deleteAfterCommit(imageKey);

        return official;
    }
}