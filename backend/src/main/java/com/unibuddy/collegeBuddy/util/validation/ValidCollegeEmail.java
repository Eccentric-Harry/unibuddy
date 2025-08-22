package com.unibuddy.collegeBuddy.util.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CollegeEmailValidator.class)
@Documented
public @interface ValidCollegeEmail {
    
    String message() default "Please use a valid college or university email address";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
}
