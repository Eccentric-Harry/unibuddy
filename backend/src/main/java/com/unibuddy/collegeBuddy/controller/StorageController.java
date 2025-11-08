package com.unibuddy.collegeBuddy.controller;

import com.unibuddy.collegeBuddy.entity.User;
import com.unibuddy.collegeBuddy.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/storage")
@RequiredArgsConstructor
@Slf4j
public class StorageController {

    private final StorageService storageService;

    /**
     * Upload a single image file using flat storage structure
     *
     * @param file The image file to upload
     * @param user The authenticated user
     * @return The uploaded file metadata compatible with frontend expectations
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) {

        try {
            StorageService.UploadedFileDto uploadedFile = storageService.uploadFile(file, user.getId());

            // Return response in format expected by frontend
            Map<String, String> response = new HashMap<>();
            response.put("url", uploadedFile.url());
            response.put("path", uploadedFile.path());
            response.put("alt", uploadedFile.alt());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("Invalid file upload request: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);

        } catch (IOException e) {
            log.error("Error uploading file", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Upload multiple image files using flat storage structure
     *
     * @param files Array of image files to upload
     * @param user  The authenticated user
     * @return List of uploaded file metadata
     */
    @PostMapping("/upload-multiple")
    public ResponseEntity<?> uploadMultipleImages(
            @RequestParam("files") MultipartFile[] files,
            @AuthenticationPrincipal User user) {

        List<Map<String, String>> uploadedFiles = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                StorageService.UploadedFileDto uploadedFile = storageService.uploadFile(file, user.getId());

                Map<String, String> fileInfo = new HashMap<>();
                fileInfo.put("url", uploadedFile.url());
                fileInfo.put("path", uploadedFile.path());
                fileInfo.put("alt", uploadedFile.alt());
                uploadedFiles.add(fileInfo);

            } catch (IllegalArgumentException | IOException e) {
                log.error("Error uploading file: {}", file.getOriginalFilename(), e);
                errors.add(file.getOriginalFilename() + ": " + e.getMessage());
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("uploaded", uploadedFiles);
        response.put("errors", errors);

        return ResponseEntity.ok(response);
    }

    /**
     * Delete a file
     *
     * @param path The file path to delete
     * @return Success/error response
     */
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFile(@RequestParam String path) {
        try {
            boolean deleted = storageService.deleteFile(path);

            Map<String, Object> response = new HashMap<>();
            response.put("success", deleted);
            response.put("message", deleted ? "File deleted successfully" : "File not found");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error deleting file: {}", path, e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
