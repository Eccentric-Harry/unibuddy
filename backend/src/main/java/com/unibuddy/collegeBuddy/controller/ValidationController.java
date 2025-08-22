package com.unibuddy.collegeBuddy.controller;

import com.unibuddy.collegeBuddy.service.EmailValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/validation")
@RequiredArgsConstructor
public class ValidationController {
    
    private final EmailValidationService emailValidationService;
    
    @GetMapping("/email/{email}")
    public ResponseEntity<Map<String, Object>> validateEmail(@PathVariable String email) {
        boolean isValid = emailValidationService.isCollegeEmail(email);
        String domain = emailValidationService.getDomain(email);
        
        return ResponseEntity.ok(Map.of(
            "email", email,
            "isValidCollegeEmail", isValid,
            "domain", domain != null ? domain : "invalid",
            "strictMode", emailValidationService.isStrictMode()
        ));
    }
}
