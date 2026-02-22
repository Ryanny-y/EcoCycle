package com.ecocycle.backend.infrastructure.storage.s3.service;

import com.ecocycle.backend.infrastructure.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class S3StorageService implements FileStorageService {

    private final S3Client s3Client;

    @Value("${aws.bucket-name}")
    private String bucketName;

    @Value("${aws.region}")
    private String region;

    @Override
    public String uploadFile(MultipartFile file) {
        String key = UUID.randomUUID() + "-" + file.getOriginalFilename();

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .acl("public-read")
                    .build();

            s3Client.putObject(
                    putObjectRequest,
                    RequestBody.fromBytes(file.getBytes())
            );

            return key;

        } catch (IOException e) {
            throw new RuntimeException("Error uploading file", e);
        }
    }

    @Override
    public void deleteFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return;

        String key = imageUrl.replace(
                "https://" + bucketName + ".s3.amazonaws.com/", ""
        );

        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        s3Client.deleteObject(deleteObjectRequest);
    }
}
