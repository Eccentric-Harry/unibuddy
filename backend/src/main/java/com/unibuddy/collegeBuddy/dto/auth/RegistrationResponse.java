package com.unibuddy.collegeBuddy.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationResponse {
    private String message;
    private String email;
    private String name;
    private boolean otpSent;
    private int otpExpiryMinutes;
}
