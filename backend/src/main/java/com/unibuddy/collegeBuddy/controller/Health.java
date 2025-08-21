package com.unibuddy.collegeBuddy.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class Health {

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "UniBuddy College Buddy");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<String> simpleHealthCheck() {
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/detailed")
    public ResponseEntity<Map<String, Object>> detailedHealthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "UniBuddy College Buddy");
        response.put("version", "0.0.1-SNAPSHOT");

        // System information
        Map<String, Object> system = new HashMap<>();
        system.put("javaVersion", System.getProperty("java.version"));
        system.put("osName", System.getProperty("os.name"));
        system.put("availableProcessors", Runtime.getRuntime().availableProcessors());
        system.put("maxMemory", Runtime.getRuntime().maxMemory());
        system.put("freeMemory", Runtime.getRuntime().freeMemory());
        system.put("totalMemory", Runtime.getRuntime().totalMemory());

        response.put("system", system);
        response.put("uptime", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }
}
