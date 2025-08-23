package com.unibuddy.collegeBuddy.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerifyTOTPRequest {
    
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "TOTP code is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "TOTP code must be 6 digits")
    private String totpCode;
}
