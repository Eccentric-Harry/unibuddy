package com.unibuddy.collegeBuddy.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class StorageService {

    private final Path uploadPath;
    private final String baseUrl;

    public StorageService(
            @Value("${app.upload.dir:uploads}") String uploadDir,
            @Value("${app.base-url:http://localhost:8080}") String baseUrl) {

        this.baseUrl = baseUrl;
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.uploadPath);
            log.info("✓ Upload directory created/verified at: {}", this.uploadPath);
        } catch (IOException e) {
            log.error("Failed to create upload directory: {}", this.uploadPath, e);
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    /**
     * Upload a file to local storage
     *
     * @param file   The multipart file to upload
     * @param userId The ID of the user uploading the file
     * @return The uploaded file metadata
     * @throws IOException If file upload fails
     */
    public UploadedFileDto uploadFile(MultipartFile file, UUID userId) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !isValidImageType(contentType)) {
            throw new IllegalArgumentException("Invalid file type. Only JPEG, PNG, and WebP images are allowed.");
        }

        // Validate file size (5MB max)
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 5MB");
        }

        // Clean filename and generate unique name
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            originalFilename = "file.jpg";
        }
        originalFilename = StringUtils.cleanPath(originalFilename);
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFileName = String.format("%d-%s.%s",
                System.currentTimeMillis(),
                UUID.randomUUID().toString().substring(0, 8),
                fileExtension);

        try {
            // Use flat directory structure instead of user-specific subdirectories
            // Create upload directory if it doesn't exist
            Files.createDirectories(this.uploadPath);

            // Save file directly in uploads directory
            Path targetLocation = this.uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Generate URLs for flat structure
            String relativePath = "/uploads/" + uniqueFileName;
            String publicUrl = String.format("%s/uploads/%s", baseUrl, uniqueFileName);

            log.info("✓ File uploaded successfully to: {}", targetLocation);
            log.debug("Public URL: {}", publicUrl);

            return new UploadedFileDto(relativePath, relativePath, getFileNameWithoutExtension(originalFilename));

        } catch (IOException e) {
            log.error("Error uploading file to local storage: {}", e.getMessage(), e);
            throw new IOException("Failed to upload file: " + e.getMessage(), e);
        }
    }

    /**
     * Delete a file from local storage
     *
     * @param filePath The relative path of the file to delete (e.g., "/uploads/filename.jpg" or "filename.jpg")
     * @return true if deletion was successful
     */
    public boolean deleteFile(String filePath) {
        try {
            // Extract filename from path (handle both /uploads/filename.jpg and filename.jpg)
            String fileName = filePath;
            if (filePath.startsWith("/uploads/")) {
                fileName = filePath.substring("/uploads/".length());
            } else if (filePath.contains("/")) {
                fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
            }

            Path fileToDelete = this.uploadPath.resolve(fileName).normalize();

            // Security check: ensure the file is within the upload directory
            if (!fileToDelete.startsWith(this.uploadPath)) {
                log.warn("Attempted to delete file outside upload directory: {}", filePath);
                return false;
            }

            if (Files.exists(fileToDelete)) {
                Files.delete(fileToDelete);
                log.info("✓ File deleted successfully: {}", fileName);
                return true;
            } else {
                log.warn("File not found: {}", fileName);
                return false;
            }

        } catch (IOException e) {
            log.error("Error deleting file from local storage: {}", filePath, e);
            return false;
        }
    }

    private boolean isValidImageType(String contentType) {
        return contentType.equals("image/jpeg") ||
                contentType.equals("image/png") ||
                contentType.equals("image/webp") ||
                contentType.equals("image/jpg");
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "jpg";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    private String getFileNameWithoutExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return filename;
        }
        return filename.substring(0, filename.lastIndexOf("."));
    }

    /**
     * DTO for uploaded file metadata
     */
    public record UploadedFileDto(String url, String path, String alt) {
    }
}
