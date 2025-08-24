package com.unibuddy.collegeBuddy.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private S3SupabaseStorageService s3SupabaseStorageService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${spring.profiles.active:local}")
    private String activeProfile;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_TYPES = List.of("image/jpeg", "image/png", "image/jpg", "image/webp");

    /**
     * Store files for marketplace listings using the old Supabase service
     */
    public List<String> storeFiles(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return new ArrayList<>();
        }

        // Use S3 Supabase storage for marketplace files
        return s3SupabaseStorageService.storeMarketplaceImages(files);
    }

    /**
     * Store a single chat image using S3 Supabase storage
     */
    public String storeChatImage(MultipartFile file) {
        return s3SupabaseStorageService.storeChatImage(file);
    }

    // Keep local storage method for backward compatibility and testing
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
