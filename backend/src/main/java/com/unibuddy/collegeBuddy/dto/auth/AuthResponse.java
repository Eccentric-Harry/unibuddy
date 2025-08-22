package com.unibuddy.collegeBuddy.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private UserInfo user;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private UUID id;
        private String name;
        private String email;
        private Long collegeId;
        private String collegeName;
        private Short year;
        private String role;
        private String avatarUrl;
        private Boolean emailVerified;
    }
}
