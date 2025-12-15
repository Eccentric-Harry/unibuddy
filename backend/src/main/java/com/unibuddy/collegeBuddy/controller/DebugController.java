package com.unibuddy.collegeBuddy.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/debug")
@Slf4j
public class DebugController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    /**
     * Debug endpoint to check upload directory status
     */
    @GetMapping("/uploads")
    public ResponseEntity<Map<String, Object>> debugUploads() {
        Map<String, Object> debug = new HashMap<>();

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            debug.put("uploadDir", uploadDir);
            debug.put("resolvedPath", uploadPath.toString());
            debug.put("exists", Files.exists(uploadPath));
            debug.put("isDirectory", Files.isDirectory(uploadPath));
            debug.put("isReadable", Files.isReadable(uploadPath));
            debug.put("isWritable", Files.isWritable(uploadPath));

            if (Files.exists(uploadPath) && Files.isDirectory(uploadPath)) {
                List<String> files = Files.list(uploadPath)
                    .map(p -> p.getFileName().toString())
                    .sorted()
                    .collect(Collectors.toList());
                debug.put("fileCount", files.size());
                debug.put("files", files);
            }

            debug.put("workingDirectory", System.getProperty("user.dir"));

        } catch (IOException e) {
            debug.put("error", e.getMessage());
            log.error("Error debugging uploads directory", e);
        }

        return ResponseEntity.ok(debug);
    }
}
