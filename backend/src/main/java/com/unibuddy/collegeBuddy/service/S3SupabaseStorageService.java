package com.unibuddy.collegeBuddy.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class S3SupabaseStorageService {

    @Value("${supabase.s3.endpoint}")
    private String s3Endpoint;

    @Value("${supabase.s3.region}")
    private String s3Region;

    @Value("${supabase.s3.access-key}")
    private String s3AccessKey;

    @Value("${supabase.s3.secret-key}")
    private String s3SecretKey;

    @Value("${supabase.storage.bucket}")
    private String bucketName;

    @Value("${supabase.project-id}")
    private String projectId;

    private S3Client s3Client;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_TYPES = List.of("image/jpeg", "image/png", "image/jpg", "image/webp");

    @PostConstruct
    public void initializeS3Client() {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(s3AccessKey, s3SecretKey);
        
        this.s3Client = S3Client.builder()
                .region(Region.of(s3Region))
                .endpointOverride(URI.create(s3Endpoint))
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .forcePathStyle(true) // Required for S3-compatible services
                .build();
        
        log.info("S3 Supabase Storage Service initialized with endpoint: {}", s3Endpoint);
    }

    @PreDestroy
    public void closeS3Client() {
        if (s3Client != null) {
            s3Client.close();
        }
    }

    /**
     * Store a single file in the chat folder
     */
    public String storeChatImage(MultipartFile file) {
        return storeFile(file, "chats");
    }

    /**
     * Store multiple files in the marketplace folder
     */
    public List<String> storeMarketplaceImages(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return new ArrayList<>();
        }

        List<String> fileUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            String fileUrl = storeFile(file, "marketplace");
            fileUrls.add(fileUrl);
        }
        return fileUrls;
    }

    /**
     * Store a file in the specified folder
     */
    private String storeFile(MultipartFile file, String folder) {
        validateFile(file);
        
        try {
            // Generate unique filename with folder structure
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
            String filename = folder + "/" + UUID.randomUUID().toString() + extension;

            // Create put object request
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(filename)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();

            // Upload file
            PutObjectResponse response = s3Client.putObject(putObjectRequest, 
                RequestBody.fromBytes(file.getBytes()));

            if (response.sdkHttpResponse().isSuccessful()) {
                // Return public URL - trying multiple formats to ensure compatibility
                String publicUrl = String.format(
                    "https://%s.supabase.co/storage/v1/object/public/%s/%s",
                    projectId, bucketName, filename
                );
                
                // Alternative format that might work better
                String alternativeUrl = String.format(
                    "https://%s.storage.supabase.co/object/public/%s/%s",
                    projectId, bucketName, filename
                );
                
                log.info("Successfully uploaded file to S3 with filename: {}", filename);
                log.info("Generated public URL: {}", publicUrl);
                log.info("Alternative URL format: {}", alternativeUrl);
                
                // Return the standard format for now, but log both for debugging
                return publicUrl;
            } else {
                log.error("Failed to upload file to S3. Status: {}", 
                    response.sdkHttpResponse().statusCode());
                throw new RuntimeException("Failed to upload file to Supabase S3 storage");
            }

        } catch (IOException ex) {
            log.error("Failed to read file for S3 upload", ex);
            throw new RuntimeException("Failed to read file for upload", ex);
        } catch (Exception ex) {
            log.error("Failed to upload file to Supabase S3", ex);
            throw new RuntimeException("Failed to upload file to Supabase S3 storage", ex);
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
