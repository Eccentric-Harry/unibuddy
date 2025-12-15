package com.unibuddy.collegeBuddy.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_TYPES = List.of("image/jpeg", "image/png", "image/jpg", "image/webp");

    /**
     * Store files for marketplace listings using local storage
     */
    public List<String> storeFiles(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return new ArrayList<>();
        }

        log.info("Using local storage for marketplace images");
        return storeFilesLocally(files);
    }

    /**
     * Store a single chat image using local storage
     */
    public String storeChatImage(MultipartFile file) {
        return storeFileLocally(file);
    }

    /**
     * Store multiple files locally and return their URLs
     */
    private List<String> storeFilesLocally(List<MultipartFile> files) {
        List<String> urls = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                String url = storeFileLocallyForMarketplace(file);
                urls.add(url);
            } catch (Exception e) {
                log.error("Failed to store file locally: {}", file.getOriginalFilename(), e);
                // Continue with other files
            }
        }

        return urls;
    }

    /**
     * Store a single file locally for marketplace and return relative URL
     */
    private String storeFileLocallyForMarketplace(MultipartFile file) {
        validateFile(file);

        try {
            // Create upload directory if it doesn't exist - use same logic as LocalStorageController
            Path projectRoot = Paths.get("").toAbsolutePath();
            Path uploadPath = projectRoot.resolve("backend").resolve(uploadDir);
            Files.createDirectories(uploadPath);

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
            String filename = UUID.randomUUID().toString() + extension;

            // Store file
            Path targetLocation = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return relative URL that will be served by static resource mapping
            return "/uploads/" + filename;

        } catch (IOException ex) {
            log.error("Failed to store file locally", ex);
            throw new RuntimeException("Failed to store file locally", ex);
        }
    }

    /**
     * Store a single file locally and return URL for backward compatibility
     */
    public String storeFileLocally(MultipartFile file) {
        validateFile(file);
        
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
            String filename = UUID.randomUUID().toString() + extension;

            // Store file
            Path targetLocation = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return URL
            return baseUrl + "/api/files/" + filename;
            
        } catch (IOException ex) {
            log.error("Failed to store file", ex);
            throw new RuntimeException("Failed to store file", ex);
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

    public Path getFilePath(String filename) {
        return Paths.get(uploadDir).resolve(filename);
    }
}
