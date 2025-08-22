package com.unibuddy.collegeBuddy.service;

import com.unibuddy.collegeBuddy.repository.CollegeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailValidationService {
    
    private final CollegeRepository collegeRepository;
    
    @Value("${app.email.validation.strict-mode:true}")
    private boolean strictMode;

    /**
     * Validates if the provided email belongs to a college/university
     * @param email The email address to validate
     * @return true if the email is from a valid educational institution
     */
    public boolean isCollegeEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            log.debug("Email validation failed: Email is null or empty");
            return false;
        }
        
        String domain = extractDomain(email);
        if (domain == null) {
            log.debug("Email validation failed: Could not extract domain from email: {}", email);
            return false;
        }
        
        log.debug("Validating email domain: {}", domain);
        
        // Check if domain exists in our database of colleges
        boolean isValid = collegeRepository.existsByDomain(domain);
        
        // In non-strict mode, allow any domain (for testing/development)
        if (!isValid && !strictMode) {
            log.debug("Strict mode disabled, allowing domain: {}", domain);
            return true;
        }
        
        if (isValid) {
            log.debug("Email validation successful: Domain {} is from a recognized educational institution", domain);
        } else {
            log.debug("Email validation failed: Domain {} is not from a recognized educational institution", domain);
        }
        
        return isValid;
    }
    
    /**
     * Extracts the domain from an email address
     * @param email The email address
     * @return The domain part of the email, or null if invalid
     */
    private String extractDomain(String email) {
        try {
            int atIndex = email.lastIndexOf('@');
            if (atIndex == -1 || atIndex == 0 || atIndex == email.length() - 1) {
                return null;
            }
            return email.substring(atIndex + 1).toLowerCase().trim();
        } catch (Exception e) {
            log.error("Error extracting domain from email: {}", email, e);
            return null;
        }
    }
    
    /**
     * Gets the domain from an email for display purposes
     * @param email The email address
     * @return The domain part
     */
    public String getDomain(String email) {
        return extractDomain(email);
    }
    
    /**
     * Checks if the validation is running in strict mode
     * @return true if strict mode is enabled
     */
    public boolean isStrictMode() {
        return strictMode;
    }
}
