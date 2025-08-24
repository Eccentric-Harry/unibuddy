package com.unibuddy.collegeBuddy.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class SupabaseStorageService {

    @Value("${supabase.project-id}")
    private String projectId;

    @Value("${supabase.anon-key}")
    private String anonKey;

    @Value("${supabase.storage.bucket}")
    private String bucketName;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_TYPES = List.of("image/jpeg", "image/png", "image/jpg", "image/webp");

    public List<String> storeFiles(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return new ArrayList<>();
        }

        List<String> fileUrls = new ArrayList<>();
        
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            
            validateFile(file);
            String fileUrl = storeFile(file);
            fileUrls.add(fileUrl);
        }
        
        return fileUrls;
    }

    private String storeFile(MultipartFile file) {
        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
            String filename = "marketplace/" + UUID.randomUUID().toString() + extension;

            // Prepare upload URL
            String uploadUrl = String.format(
                "https://%s.supabase.co/storage/v1/object/%s/%s",
                projectId, bucketName, filename
            );

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + anonKey);
            
            String contentType = file.getContentType();
            if (contentType != null) {
                headers.setContentType(MediaType.parseMediaType(contentType));
            } else {
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            }
            headers.set("x-upsert", "true"); // Allow overwrite

            // Create request entity
            HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

            // Upload file
            ResponseEntity<String> response = restTemplate.exchange(
                uploadUrl,
                HttpMethod.POST,
                requestEntity,
                String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                String publicUrl = String.format(
                    "https://%s.supabase.co/storage/v1/object/public/%s/%s",
                    projectId, bucketName, filename
                );
                log.info("Successfully uploaded file: {}", publicUrl);
                return publicUrl;
            } else {
                log.error("Failed to upload file. Status: {}, Response: {}", 
                    response.getStatusCode(), response.getBody());
                throw new RuntimeException("Failed to upload file to Supabase storage");
            }

        } catch (IOException ex) {
            log.error("Failed to read file", ex);
            throw new RuntimeException("Failed to read file", ex);
        } catch (Exception ex) {
            log.error("Failed to upload file to Supabase", ex);
            throw new RuntimeException("Failed to upload file to Supabase storage", ex);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of 5MB");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only image files (JPEG, PNG, WebP) are allowed");
        }
    }
}
