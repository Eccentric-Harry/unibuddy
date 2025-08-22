package com.unibuddy.collegeBuddy.service;

import com.unibuddy.collegeBuddy.entity.College;
import com.unibuddy.collegeBuddy.repository.CollegeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class CollegeDataServiceTest {

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private CollegeDataService collegeDataService;

    @Test
    void testCollegeDataInitialization() throws Exception {
        // Clear any existing data
        collegeRepository.deleteAll();
        
        // Run the initialization
        collegeDataService.run();
        
        // Verify data was loaded
        long count = collegeRepository.count();
        assertTrue(count > 300, "Should have loaded more than 300 colleges, but found: " + count);
        
        // Test specific institutions
        Optional<College> iitBombay = collegeRepository.findByDomain("iitb.ac.in");
        assertTrue(iitBombay.isPresent(), "IIT Bombay should be present");
        assertEquals("Indian Institute of Technology Bombay", iitBombay.get().getName());
        assertTrue(iitBombay.get().getVerified(), "IIT Bombay should be verified");
        
        Optional<College> vitVellore = collegeRepository.findByDomain("vitastudent.ac.in");
        assertTrue(vitVellore.isPresent(), "VIT should be present");
        assertEquals("VIT University", vitVellore.get().getName());
        
        // Test search functionality
        assertTrue(collegeRepository.existsByDomain("iitd.ac.in"), "IIT Delhi should exist");
        assertTrue(collegeRepository.existsByDomain("nitt.edu"), "NIT Trichy should exist");
        assertTrue(collegeRepository.existsByDomain("iisc.ac.in"), "IISc should exist");
    }

    @Test
    void testEmailValidationService() {
        // Clear and initialize data
        collegeRepository.deleteAll();
        try {
            collegeDataService.run();
        } catch (Exception e) {
            fail("Failed to initialize college data: " + e.getMessage());
        }
        
        EmailValidationService emailValidationService = new EmailValidationService(collegeRepository);
        
        // Test valid emails
        assertTrue(emailValidationService.isCollegeEmail("student@iitb.ac.in"));
        assertTrue(emailValidationService.isCollegeEmail("user@vitastudent.ac.in"));
        assertTrue(emailValidationService.isCollegeEmail("test@nitt.edu"));
        
        // Test invalid emails
        assertFalse(emailValidationService.isCollegeEmail("user@gmail.com"));
        assertFalse(emailValidationService.isCollegeEmail("test@yahoo.com"));
        assertFalse(emailValidationService.isCollegeEmail("invalid@unknownuniversity.com"));
        
        // Test edge cases
        assertFalse(emailValidationService.isCollegeEmail(""));
        assertFalse(emailValidationService.isCollegeEmail(null));
        assertFalse(emailValidationService.isCollegeEmail("notanemail"));
    }
}
