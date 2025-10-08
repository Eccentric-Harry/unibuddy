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
     * Upload a single image file
     *
     * @param file The image file to upload
     * @param user The authenticated user
     * @return The uploaded file metadata
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) {

        try {
            StorageService.UploadedFileDto uploadedFile = storageService.uploadFile(file, user.getId());
            return ResponseEntity.ok(uploadedFile);

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
     * Upload multiple image files
     *
     * @param files Array of image files to upload
     * @param user  The authenticated user
     * @return List of uploaded file metadata
     */
    @PostMapping("/upload-multiple")
    public ResponseEntity<?> uploadMultipleImages(
            @RequestParam("files") MultipartFile[] files,
            @AuthenticationPrincipal User user) {

        if (files.length > 5) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Maximum 5 images allowed");
            return ResponseEntity.badRequest().body(error);
        }

        List<StorageService.UploadedFileDto> uploadedFiles = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        for (int i = 0; i < files.length; i++) {
            try {
                StorageService.UploadedFileDto uploadedFile = storageService.uploadFile(files[i], user.getId());
                uploadedFiles.add(uploadedFile);

            } catch (Exception e) {
                log.error("Error uploading file {}", i, e);
                errors.add(String.format("File %d: %s", i, e.getMessage()));
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("uploaded", uploadedFiles);
        response.put("errors", errors);

        if (uploadedFiles.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Delete an uploaded file
     *
     * @param path The path of the file to delete
     * @return Success message
     */
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFile(@RequestParam("path") String path) {
        boolean deleted = storageService.deleteFile(path);

        Map<String, Object> response = new HashMap<>();
        response.put("success", deleted);
        response.put("message", deleted ? "File deleted successfully" : "Failed to delete file");

        return deleted ? ResponseEntity.ok(response) : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}

