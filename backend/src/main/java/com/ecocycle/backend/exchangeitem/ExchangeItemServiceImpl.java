package com.ecocycle.backend.exchangeitem;

import com.ecocycle.backend.exchangeitem.model.ItemType;
import com.ecocycle.backend.exchangeitem.model.MainCategory;
import com.ecocycle.backend.infrastructure.storage.FileStorageService;
import com.ecocycle.backend.exchangeitem.dto.request.CreateExchangeItemRequest;
import com.ecocycle.backend.exchangeitem.dto.request.UpdateExchangeItemRequest;
import com.ecocycle.backend.exchangeitem.exceptions.ExchangeItemAlreadyExists;
import com.ecocycle.backend.exchangeitem.exceptions.ExchangeItemNotFoundException;
import com.ecocycle.backend.exchangeitem.model.ExchangeItem;
import com.ecocycle.backend.exchangeitem.repository.ExchangeItemRepository;
import com.ecocycle.backend.infrastructure.storage.TransactionalFileDeletionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExchangeItemServiceImpl implements ExchangeItemService {

    private final TransactionalFileDeletionService transactionalFileDeletionService;
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

        } catch (RuntimeException ex) {
            fileStorageService.deleteFile(imageKey);
            throw ex;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExchangeItem> getExchangeItems(String search, MainCategory mainCategory, ItemType itemType) {
        return exchangeItemRepository.findAllBySearchMainCategoryItemType(search, mainCategory, itemType);
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
                        "Update failed: Exchange item with name: " + request.getName() + " already exists."
                );
            }
            exchangeItem.setName(request.getName());
        }

//        Without Check for nullable Values
        exchangeItem.setDescription(request.getDescription());
        exchangeItem.setSubCategory(request.getSubCategory());
        exchangeItem.setFarmOrigin(request.getFarmOrigin());

//        Check Not nullable Values
        if (request.getItemType() != null) exchangeItem.setItemType(request.getItemType());
        if (request.getMainCategory() != null) exchangeItem.setMainCategory(request.getMainCategory());

        if (request.getStocks() != null) {
            // Check if stocks increased
            if (request.getStocks() > originalStocks) {
                stocksIncreased = true;
            }
            exchangeItem.setStocks(request.getStocks());
        }

        if (request.getRequiredPoints() != null) exchangeItem.setRequiredPoints(request.getRequiredPoints());
        if (request.getUnit() != null) exchangeItem.setUnit(request.getUnit());

        // Update lastRestocked if stocks increased
        if (stocksIncreased) {
            exchangeItem.setLastRestocked(LocalDateTime.now());
        }

        if (request.getImage() != null) {
            String oldImage = exchangeItem.getImageUrl();
            String newImageKey = fileStorageService.uploadFile(request.getImage());

            try {
                exchangeItem.setImageUrl(newImageKey);
                transactionalFileDeletionService.deleteAfterCommit(oldImage);
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

        transactionalFileDeletionService.deleteAfterCommit(imageKey);

        return exchangeItem;
    }
}