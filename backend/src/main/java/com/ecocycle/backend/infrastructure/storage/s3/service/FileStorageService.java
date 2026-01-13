package com.ecocycle.backend.infrastructure.storage.s3.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String uploadFile(MultipartFile file);
    String getFileUrl(String key);
}
