package com.unibuddy.collegeBuddy.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "app.email.validation.strict-mode=true",
    "app.email.validation.custom-domains="
})
class EmailValidationServiceTest {

    @Autowired
    private EmailValidationService emailValidationService;

    @Test
    void shouldValidateEducationalDomains() {
        // Test Indian educational domains with .ac.in pattern
        assertTrue(emailValidationService.isCollegeEmail("student@iitd.ac.in"));
        assertTrue(emailValidationService.isCollegeEmail("user@iitb.ac.in"));
        assertTrue(emailValidationService.isCollegeEmail("student@du.ac.in"));
        assertTrue(emailValidationService.isCollegeEmail("test@jnu.ac.in"));
        assertTrue(emailValidationService.isCollegeEmail("student@bits-pilani.ac.in"));
        
        // Test special case domains
        assertTrue(emailValidationService.isCollegeEmail("student@nitt.edu"));
        assertTrue(emailValidationService.isCollegeEmail("user@manipal.edu"));
    }

    @Test
    void shouldValidateCustomDomains() {
        // Test that domains in the database work (these should be in the college database)
        // Note: The system validates against actual college domains in the database,
        // not just any .ac.in domain pattern
        assertTrue(emailValidationService.isCollegeEmail("student@iitd.ac.in"));
        assertTrue(emailValidationService.isCollegeEmail("user@du.ac.in"));
    }

    @Test
    void shouldRejectNonEducationalDomains() {
        // Test non-educational domains
        assertFalse(emailValidationService.isCollegeEmail("user@gmail.com"));
        assertFalse(emailValidationService.isCollegeEmail("test@yahoo.com"));
        assertFalse(emailValidationService.isCollegeEmail("admin@company.com"));
        assertFalse(emailValidationService.isCollegeEmail("user@example.org"));
        
        // Test non-Indian educational domains (should now be rejected)
        assertFalse(emailValidationService.isCollegeEmail("student@stanford.edu"));
        assertFalse(emailValidationService.isCollegeEmail("user@oxford.ac.uk"));
        assertFalse(emailValidationService.isCollegeEmail("test@university.edu.au"));
    }

    @Test
    void shouldHandleInvalidEmails() {
        // Test invalid email formats
        assertFalse(emailValidationService.isCollegeEmail(""));
        assertFalse(emailValidationService.isCollegeEmail(null));
        assertFalse(emailValidationService.isCollegeEmail("invalid-email"));
        assertFalse(emailValidationService.isCollegeEmail("@domain.edu"));
        assertFalse(emailValidationService.isCollegeEmail("user@"));
    }

    @Test
    void shouldExtractDomainCorrectly() {
        assertEquals("iitd.ac.in", emailValidationService.getDomain("student@iitd.ac.in"));
        assertEquals("anycollege.ac.in", emailValidationService.getDomain("user@anycollege.ac.in"));
        assertNull(emailValidationService.getDomain("invalid-email"));
    }

    @Test
    void shouldRespectStrictMode() {
        assertTrue(emailValidationService.isStrictMode());
    }
}
