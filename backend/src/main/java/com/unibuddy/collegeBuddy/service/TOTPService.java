package com.unibuddy.collegeBuddy.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * Service for generating and validating verification codes for email verification.
 * Uses secure random 6-digit codes with time-based expiration.
 */
@Service
@Slf4j
public class TOTPService {
    
    // Code validity window in seconds (5 minutes)
    private static final int CODE_VALIDITY_WINDOW = 300;
    
    /**
     * Generates a secure random 6-digit verification code
     * @return 6-digit verification code as string
     */
    public String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000); // Generates number between 100000-999999
        return String.valueOf(code);
    }
    
    /**
     * Generates a random secret key (for future TOTP implementation if needed)
     * @return Base32 encoded secret key
     */
    public String generateSecret() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[20]; // 160 bits
        random.nextBytes(bytes);
        // Simple base32-like encoding for demo purposes
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02X", b));
        }
        return sb.toString();
    }
    
    /**
     * Validates a verification code against the stored code and creation time
     * @param storedCode The code that was generated and stored
     * @param providedCode The code provided by the user
     * @param createdAt The time when the code was created
     * @return true if the code is valid and not expired
     */
    public boolean validateVerificationCode(String storedCode, String providedCode, LocalDateTime createdAt) {
        try {
            // Check if code has expired
            if (isCodeExpired(createdAt)) {
                log.debug("Verification code has expired. Created at: {}", createdAt);
                return false;
            }
            
            // Validate the code
            boolean isValid = storedCode != null && storedCode.equals(providedCode);
            log.debug("Code validation result: {}. Stored: {}, Provided: {}", isValid, storedCode, providedCode);
            return isValid;
            
        } catch (Exception e) {
            log.error("Error validating verification code", e);
            return false;
        }
    }
    
    /**
     * Checks if a verification code has expired based on creation time
     * @param createdAt The time when the code was created
     * @return true if the code has expired
     */
    public boolean isCodeExpired(LocalDateTime createdAt) {
        if (createdAt == null) {
            return true;
        }
        
        long createdAtMillis = createdAt.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        long currentTime = System.currentTimeMillis();
        boolean expired = (currentTime - createdAtMillis) > (CODE_VALIDITY_WINDOW * 1000L);
        
        log.debug("Code expiry check. Created: {}, Current: {}, Expired: {}", 
                 createdAt, LocalDateTime.now(), expired);
        return expired;
    }
    
    /**
     * Gets the validity window in seconds
     * @return validity window in seconds
     */
    public int getValidityWindow() {
        return CODE_VALIDITY_WINDOW;
    }
    
    // Legacy methods for backward compatibility
    
    /**
     * @deprecated Use generateVerificationCode() instead
     */
    @Deprecated
    public String generateTOTPCode(String secret) {
        return generateVerificationCode();
    }
    
    /**
     * @deprecated Use validateVerificationCode() instead
     */
    @Deprecated
    public boolean validateTOTPCode(String secret, String code) {
        // This method is deprecated but kept for compatibility
        // In practice, we should use the new validation method with stored code and creation time
        log.warn("Using deprecated validateTOTPCode method. Consider updating to validateVerificationCode.");
        return false; // Always return false to force migration to new method
    }
    
    /**
     * @deprecated Use isCodeExpired(LocalDateTime) instead
     */
    @Deprecated
    public boolean isTOTPExpired(long createdAt) {
        long currentTime = System.currentTimeMillis();
        return (currentTime - createdAt) > (CODE_VALIDITY_WINDOW * 1000L);
    }
}
