package com.ecocycle.backend.infrastructure.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
@RequiredArgsConstructor
public class TransactionalFileDeletionService {

    private final FileStorageService fileStorageService;

    public void deleteAfterCommit(String fileKey) {
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
