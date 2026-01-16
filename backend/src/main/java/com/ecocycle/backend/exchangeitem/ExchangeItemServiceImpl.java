package com.ecocycle.backend.exchangeitem;

import com.ecocycle.backend.infrastructure.storage.FileStorageService;
import com.ecocycle.backend.exchangeitem.dto.request.CreateExchangeItemRequest;
import com.ecocycle.backend.exchangeitem.dto.request.UpdateExchangeItemRequest;
import com.ecocycle.backend.exchangeitem.exceptions.ExchangeItemAlreadyExists;
import com.ecocycle.backend.exchangeitem.exceptions.ExchangeItemNotFoundException;
import com.ecocycle.backend.exchangeitem.model.ExchangeItem;
import com.ecocycle.backend.exchangeitem.repository.ExchangeItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExchangeItemServiceImpl implements ExchangeItemService {

    private final ExchangeItemRepository exchangeItemRepository;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public ExchangeItem createExchangeItem(CreateExchangeItemRequest request) {
        if (exchangeItemRepository.existsByName(request.getName())) {
            throw new ExchangeItemAlreadyExists(
                    "Exchange item with name: " + request.getName() + " already exists"
            );
        }

        String imageKey = fileStorageService.uploadFile(request.getImage());

        try {
            ExchangeItem exchangeItem = ExchangeItem.builder()
                    .name(request.getName())
                    .description(request.getDescription())
                    .itemType(request.getItemType())
                    .mainCategory(request.getMainCategory())
                    .subCategory(request.getSubCategory())
                    .stocks(request.getStocks())
                    .requiredPoints(request.getRequiredPoints())
                    .unit(request.getUnit())
                    .farmOrigin(request.getFarmOrigin())
                    .imageUrl(imageKey)
                    .build();

            return exchangeItemRepository.save(exchangeItem);

        } catch (DataIntegrityViolationException ex) {
            fileStorageService.deleteFile(imageKey);
            throw new ExchangeItemAlreadyExists(
                    "Exchange item with name: " + request.getName() + " already exists"
            );
        } catch (RuntimeException ex) {
            fileStorageService.deleteFile(imageKey);
            throw ex;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExchangeItem> getExchangeItems() {
        return exchangeItemRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public ExchangeItem getExchangeItemById(UUID id) {
        return exchangeItemRepository.findById(id)
                .orElseThrow(() -> new ExchangeItemNotFoundException("Exchange item not found with ID: " + id));
    }

    @Override
    @Transactional
    public ExchangeItem updateExchangeItem(UUID id, UpdateExchangeItemRequest request) {
        ExchangeItem exchangeItem = getExchangeItemById(id);

        // Track if stocks are changing
        boolean stocksIncreased = false;
        Integer originalStocks = exchangeItem.getStocks();

        if (request.getName() != null && !request.getName().equals(exchangeItem.getName())) {
            if (exchangeItemRepository.existsByNameAndIdNot(request.getName(), id)) {
                throw new ExchangeItemAlreadyExists(
                        "Update failed: Exchange item with name: " + request.getName() + " already exists"
                );
            }
            exchangeItem.setName(request.getName());
        }

        if (request.getDescription() != null) exchangeItem.setDescription(request.getDescription());
        if (request.getItemType() != null) exchangeItem.setItemType(request.getItemType());
        if (request.getMainCategory() != null) exchangeItem.setMainCategory(request.getMainCategory());
        if (request.getSubCategory() != null) exchangeItem.setSubCategory(request.getSubCategory());

        if (request.getStocks() != null) {
            // Check if stocks increased
            if (request.getStocks() > originalStocks) {
                stocksIncreased = true;
            }
            exchangeItem.setStocks(request.getStocks());
        }

        if (request.getRequiredPoints() != null) exchangeItem.setRequiredPoints(request.getRequiredPoints());
        if (request.getUnit() != null) exchangeItem.setUnit(request.getUnit());
        if (request.getFarmOrigin() != null) exchangeItem.setFarmOrigin(request.getFarmOrigin());

        // Update lastRestocked if stocks increased
        if (stocksIncreased) {
            exchangeItem.setLastRestocked(LocalDateTime.now());
        }

        if (request.getImage() != null) {
            String oldImage = exchangeItem.getImageUrl();
            String newImageKey = fileStorageService.uploadFile(request.getImage());

            try {
                exchangeItem.setImageUrl(newImageKey);
                registerFileDeletionAfterCommit(oldImage);
            } catch (RuntimeException ex) {
                fileStorageService.deleteFile(newImageKey);
                throw ex;
            }
        }

        return exchangeItemRepository.save(exchangeItem);
    }

    @Override
    @Transactional
    public ExchangeItem deleteExchangeItem(UUID id) {
        ExchangeItem exchangeItem = getExchangeItemById(id);
        String imageKey = exchangeItem.getImageUrl();

        exchangeItemRepository.delete(exchangeItem);

        registerFileDeletionAfterCommit(imageKey);

        return exchangeItem;
    }

    private void registerFileDeletionAfterCommit(String fileKey) {
        if (fileKey == null) return;

        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        fileStorageService.deleteFile(fileKey);
                    }
                }
        );
    }
}