package com.unibuddy.collegeBuddy.service;

import com.unibuddy.collegeBuddy.dto.auth.RegisterRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for temporarily storing user registration data before email verification
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PendingUserService {
    
    private final ConcurrentHashMap<String, PendingUser> pendingUsers = new ConcurrentHashMap<>();
    
    public static class PendingUser {
        private final RegisterRequest registerRequest;
        private final String otp;
        private final LocalDateTime otpExpiry;
        
        public PendingUser(RegisterRequest registerRequest, String otp, LocalDateTime otpExpiry) {
            this.registerRequest = registerRequest;
            this.otp = otp;
            this.otpExpiry = otpExpiry;
        }
        
        public RegisterRequest getRegisterRequest() { return registerRequest; }
        public String getOtp() { return otp; }
        public LocalDateTime getOtpExpiry() { return otpExpiry; }
        
        public boolean isExpired() {
            return LocalDateTime.now().isAfter(otpExpiry);
        }
    }
    
    public void storePendingUser(String email, RegisterRequest request, String otp, LocalDateTime expiry) {
        pendingUsers.put(email.toLowerCase(), new PendingUser(request, otp, expiry));
        log.debug("Stored pending user for email: {}", email);
    }
    
    public PendingUser getPendingUser(String email) {
        PendingUser user = pendingUsers.get(email.toLowerCase());
        if (user != null && user.isExpired()) {
            removePendingUser(email);
            return null;
        }
        return user;
    }
    
    public void removePendingUser(String email) {
        pendingUsers.remove(email.toLowerCase());
        log.debug("Removed pending user for email: {}", email);
    }
    
    public boolean hasPendingUser(String email) {
        return getPendingUser(email) != null;
    }
    
    // Clean up expired entries periodically (could be enhanced with @Scheduled)
    public void cleanupExpiredEntries() {
        pendingUsers.entrySet().removeIf(entry -> entry.getValue().isExpired());
    }
}
