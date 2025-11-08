package com.unibuddy.collegeBuddy.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
@Slf4j
public class FileTestController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    /**
     * Alternative endpoint to serve files directly if static resource handler fails
     */
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path filePath = uploadPath.resolve(filename).normalize();

            // Security check: ensure the file is within the upload directory
            if (!filePath.startsWith(uploadPath)) {
                log.warn("Attempted to access file outside upload directory: {}", filename);
                return ResponseEntity.notFound().build();
            }

            if (!Files.exists(filePath)) {
                log.warn("File not found: {}", filePath);
                return ResponseEntity.notFound().build();
            }

            Resource resource = new FileSystemResource(filePath);

            // Determine content type
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            log.info("Serving file: {} with content type: {}", filePath, contentType);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(resource);

        } catch (IOException e) {
            log.error("Error serving file: {}", filename, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
