package com.unibuddy.collegeBuddy.service;

import com.unibuddy.collegeBuddy.dto.listing.CreateListingRequest;
import com.unibuddy.collegeBuddy.dto.listing.ListingResponse;
import com.unibuddy.collegeBuddy.entity.User;
import com.unibuddy.collegeBuddy.repository.ListingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ListingServiceIntegrationTest {

    @Autowired
    private ListingService listingService;

    @Autowired
    private ListingRepository listingRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setEmailVerified(true);
        testUser.setRole(User.Role.STUDENT);
    }

    @Test
    void testCreateListing() {
        // Given
        CreateListingRequest request = new CreateListingRequest();
        request.setTitle("Test Laptop");
        request.setDescription("A great laptop for students");
        request.setPrice(new BigDecimal("500.00"));
        request.setCategory("Electronics");

        // When
        ListingResponse response = listingService.createListing(request, testUser);

        // Then
        assertNotNull(response);
        assertNotNull(response.getId());
        assertEquals("Test Laptop", response.getTitle());
        assertEquals("A great laptop for students", response.getDescription());
        assertEquals(new BigDecimal("500.00"), response.getPrice());
        assertEquals("Electronics", response.getCategory());
        assertEquals("ACTIVE", response.getStatus());

        // Verify it was saved to database
        assertTrue(listingRepository.findById(response.getId()).isPresent());
    }

    @Test
    void testCreateListingWithUnverifiedUser() {
        // Given
        testUser.setEmailVerified(false);
        CreateListingRequest request = new CreateListingRequest();
        request.setTitle("Test Item");
        request.setDescription("Test description");
        request.setPrice(new BigDecimal("100.00"));
        request.setCategory("Books");

        // When & Then
        assertThrows(IllegalStateException.class, () -> {
            listingService.createListing(request, testUser);
        });
    }
}
