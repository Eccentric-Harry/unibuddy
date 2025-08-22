package com.unibuddy.collegeBuddy.util.validation;

import com.unibuddy.collegeBuddy.service.EmailValidationService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class CollegeEmailValidator implements ConstraintValidator<ValidCollegeEmail, String> {
    
    private final EmailValidationService emailValidationService;
    
    @Override
    public void initialize(ValidCollegeEmail constraintAnnotation) {
        // No initialization needed
    }
    
    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        // Allow null values (use @NotBlank for null checking)
        if (email == null || email.trim().isEmpty()) {
            return true;
        }
        
        boolean isValid = emailValidationService.isCollegeEmail(email);
        
        if (!isValid) {
            log.debug("College email validation failed for: {}", email);
            
            // Customize error message based on the domain
            String domain = emailValidationService.getDomain(email);
            if (domain != null) {
                String customMessage = String.format(
                    "The domain '%s' is not recognized as a college or university email. Please use your official student email address.", 
                    domain
                );
                
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(customMessage)
                       .addConstraintViolation();
            }
        }
        
        return isValid;
    }
}
