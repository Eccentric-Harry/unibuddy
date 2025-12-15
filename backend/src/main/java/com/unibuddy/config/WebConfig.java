package com.unibuddy.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@Slf4j
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Use same logic as StorageService to resolve upload directory path
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();

        // Create directory if it doesn't exist
        try {
            Files.createDirectories(uploadPath);
            log.info("✓ Serving static files from: {}", uploadPath);
        } catch (IOException e) {
            log.error("Failed to create upload directory: {}", uploadPath, e);
        }

        // Map /uploads/** URLs to the physical upload directory
        // The resource location needs to end with "/" to work properly
        String resourceLocation = "file:" + uploadPath.toString();
        if (!resourceLocation.endsWith("/")) {
            resourceLocation += "/";
        }

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resourceLocation)
                .setCachePeriod(3600); // Cache for 1 hour

        log.info("✓ Static resource handler configured: /uploads/** -> {}", resourceLocation);
        log.info("✓ Upload directory exists: {}", Files.exists(uploadPath));
        log.info("✓ Upload directory is readable: {}", Files.isReadable(uploadPath));
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(frontendUrl)
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
        
        log.info("✓ CORS configured for: {}", frontendUrl);
    }
}
