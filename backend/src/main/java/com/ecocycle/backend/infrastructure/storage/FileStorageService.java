package com.ecocycle.backend.infrastructure.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String uploadFile(MultipartFile file);
    String getFileUrl(String key);
    void deleteFile(String key);
}
