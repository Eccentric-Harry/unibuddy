package com.unibuddy.collegeBuddy.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@Slf4j
public class StorageService {

    private final RestTemplate restTemplate;
    private final String bucketName;
    private final String supabaseUrl;
    private final String supabaseServiceKey;

    public StorageService(
            @Value("${supabase.storage.bucket:listing-images}") String bucketName,
            @Value("${supabase.url:https://fdeadgzxjuqevlohtvsl.supabase.co}") String supabaseUrl,
            @Value("${supabase.service-role-key:#{null}}") String supabaseServiceKey) {

        this.restTemplate = new RestTemplate();
        this.bucketName = bucketName;
        this.supabaseUrl = supabaseUrl;
        this.supabaseServiceKey = supabaseServiceKey;

        log.info("StorageService initialized with bucket: {} and URL: {}", bucketName, supabaseUrl);

        if (supabaseServiceKey == null || supabaseServiceKey.isEmpty() || supabaseServiceKey.equals("YOUR_SERVICE_ROLE_KEY_HERE")) {
            log.error("⚠️  CRITICAL: Supabase service role key is not configured! Uploads will fail.");
            log.error("⚠️  Please set supabase.service-role-key in application.properties");
        } else {
            log.info("✓ Supabase service role key is configured");
        }
    }

    /**
     * Upload a file to Supabase Storage using REST API
     *
     * @param file   The multipart file to upload
     * @param userId The ID of the user uploading the file
     * @return The uploaded file metadata
     * @throws IOException If file upload fails
     */
    public UploadedFileDto uploadFile(MultipartFile file, UUID userId) throws IOException {
        // Check if service key is configured
        if (supabaseServiceKey == null || supabaseServiceKey.isEmpty() || supabaseServiceKey.equals("YOUR_SERVICE_ROLE_KEY_HERE")) {
            throw new IOException("Supabase service role key is not configured. Please add it to application.properties");
        }

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

        // Generate unique file path
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String fileName = String.format("%s/%d-%s.%s",
                userId,
                System.currentTimeMillis(),
                UUID.randomUUID().toString().substring(0, 8),
                fileExtension);

        try {
            // Build the Supabase Storage URL - use the correct path format
            String uploadUrl = String.format("%s/storage/v1/object/%s/%s",
                    supabaseUrl, bucketName, fileName);

            log.info("Uploading file to: {}", uploadUrl);
            log.debug("File details - Name: {}, Size: {} bytes, Type: {}",
                    file.getOriginalFilename(), file.getSize(), contentType);

            // Create headers with authorization
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.set("Authorization", "Bearer " + supabaseServiceKey);
            headers.set("apikey", supabaseServiceKey);

            // Create request entity with file bytes
            HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

            // Upload file
            ResponseEntity<String> response = restTemplate.exchange(
                    uploadUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            log.info("Supabase response status: {}", response.getStatusCode());
            log.debug("Supabase response body: {}", response.getBody());

            if (response.getStatusCode().is2xxSuccessful()) {
                // Generate public URL
                String publicUrl = String.format("%s/storage/v1/object/public/%s/%s",
                        supabaseUrl, bucketName, fileName);

                log.info("✓ File uploaded successfully: {}", publicUrl);

                return new UploadedFileDto(publicUrl, fileName, getFileNameWithoutExtension(file.getOriginalFilename()));
            } else {
                String errorMsg = String.format("Upload failed with status: %s, body: %s",
                        response.getStatusCode(), response.getBody());
                log.error(errorMsg);
                throw new IOException(errorMsg);
            }

        } catch (HttpClientErrorException e) {
            // Supabase returned 4xx error
            String errorBody = e.getResponseBodyAsString();
            log.error("Supabase client error ({}): {}", e.getStatusCode(), errorBody);

            if (errorBody.contains("Bucket not found")) {
                throw new IOException("Storage bucket '" + bucketName + "' not found. Please create it in Supabase dashboard.");
            } else if (errorBody.contains("permission") || errorBody.contains("forbidden")) {
                throw new IOException("Permission denied. Check your service role key or bucket policies.");
            } else {
                throw new IOException("Supabase upload failed: " + errorBody);
            }

        } catch (Exception e) {
            log.error("Error uploading file to Supabase Storage: {}", e.getMessage(), e);
            throw new IOException("Failed to upload file: " + e.getMessage(), e);
        }
    }

    /**
     * Delete a file from Supabase Storage
     *
     * @param filePath The path of the file to delete
     * @return true if deletion was successful
     */
    public boolean deleteFile(String filePath) {
        if (supabaseServiceKey == null || supabaseServiceKey.isEmpty()) {
            log.error("Cannot delete file: service role key not configured");
            return false;
        }

        try {
            String deleteUrl = String.format("%s/storage/v1/object/%s/%s",
                    supabaseUrl, bucketName, filePath);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseServiceKey);
            headers.set("apikey", supabaseServiceKey);

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    deleteUrl,
                    HttpMethod.DELETE,
                    requestEntity,
                    String.class
            );

            log.info("File deleted successfully: {}", filePath);
            return response.getStatusCode().is2xxSuccessful();

        } catch (Exception e) {
            log.error("Error deleting file from Supabase Storage: {}", filePath, e);
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
