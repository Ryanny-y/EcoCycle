package com.ecocycle.backend.infrastructure.storage;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.web.multipart.MultipartFile;

@TestConfiguration
public class TestFileStorageConfig {

    @Bean
    @Primary
    FileStorageService fakeFileStorageService() {
        return new FileStorageService() {
            @Override
            public String uploadFile(MultipartFile file) {
                return "fake/key.png";
            }

            @Override
            public String getFileUrl(String key) {
                return "fake/key.png";
            }

        };
    }

}
