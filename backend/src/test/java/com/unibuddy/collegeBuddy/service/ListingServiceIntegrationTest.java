package com.unibuddy.collegeBuddy.service;

import com.unibuddy.collegeBuddy.dto.listing.ExpressInterestRequest;
import com.unibuddy.collegeBuddy.dto.listing.ListingCreateRequest;
import com.unibuddy.collegeBuddy.dto.listing.ListingFiltersDto;
import com.unibuddy.collegeBuddy.dto.listing.ListingResponse;
import com.unibuddy.collegeBuddy.entity.College;
import com.unibuddy.collegeBuddy.entity.Conversation;
import com.unibuddy.collegeBuddy.entity.Listing;
import com.unibuddy.collegeBuddy.entity.User;
import com.unibuddy.collegeBuddy.repository.CollegeRepository;
import com.unibuddy.collegeBuddy.repository.ConversationRepository;
import com.unibuddy.collegeBuddy.repository.ListingRepository;
import com.unibuddy.collegeBuddy.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ListingServiceIntegrationTest {

    @Autowired
    private ListingService listingService;

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User seller;
    private User buyer;
    private College college;

    @BeforeEach
    void setUp() {
        // Create test college
        college = new College();
        college.setName("Test University");
        college.setDomain("test.edu");
        college = collegeRepository.save(college);

        // Create test seller
        seller = new User();
        seller.setName("Test Seller");
        seller.setEmail("seller@test.edu");
        seller.setPasswordHash(passwordEncoder.encode("password"));
        seller.setEmailVerified(true);
        seller.setCollege(college);
        seller = userRepository.save(seller);

        // Create test buyer
        buyer = new User();
        buyer.setName("Test Buyer");
        buyer.setEmail("buyer@test.edu");
        buyer.setPasswordHash(passwordEncoder.encode("password"));
        buyer.setEmailVerified(true);
        buyer.setCollege(college);
        buyer = userRepository.save(buyer);
    }

    @Test
    void createListing_ValidRequest_ReturnsCreatedListing() {
        // Arrange
        ListingCreateRequest request = new ListingCreateRequest();
        request.setTitle("Test Listing");
        request.setDescription("This is a test listing with a detailed description.");
        request.setPrice(new BigDecimal("25.99"));
        request.setCategory("books");

        List<ListingCreateRequest.ListingImageDto> images = new ArrayList<>();
        ListingCreateRequest.ListingImageDto image = new ListingCreateRequest.ListingImageDto();
        image.setUrl("https://example.com/test.jpg");
        image.setPath("test/test.jpg");
        image.setAlt("Test image");
        images.add(image);
        request.setImages(images);

        // Act
        ListingResponse response = listingService.createListing(request, seller);

        // Assert
        assertNotNull(response);
        assertEquals("Test Listing", response.getTitle());
        assertEquals("This is a test listing with a detailed description.", response.getDescription());
        assertEquals(0, new BigDecimal("25.99").compareTo(response.getPrice()));
        assertEquals("books", response.getCategory());
        assertEquals("ACTIVE", response.getStatus());
        assertEquals(seller.getId(), response.getSeller().getId());
        assertFalse(response.getImages().isEmpty());
        assertEquals("https://example.com/test.jpg", response.getImages().get(0).getUrl());
    }

    @Test
    void getListings_WithFilters_ReturnsFilteredListings() {
        // Arrange - Create some test listings
        createTestListing("Java Programming Book", "A great book for beginners", new BigDecimal("29.99"), "books");
        createTestListing("Python Programming Book", "Learn Python quickly", new BigDecimal("19.99"), "books");
        createTestListing("Gaming Mouse", "High-performance gaming mouse", new BigDecimal("59.99"), "electronics");

        // Act - Filter by category
        ListingFiltersDto filters = new ListingFiltersDto();
        filters.setCategory("books");
        Page<ListingResponse> bookListings = listingService.getListings(filters);

        // Assert
        assertEquals(2, bookListings.getTotalElements());
        assertTrue(bookListings.getContent().stream().allMatch(l -> l.getCategory().equals("books")));

        // Act - Filter by price range
        filters = new ListingFiltersDto();
        filters.setMinPrice(new BigDecimal("20.00"));
        filters.setMaxPrice(new BigDecimal("50.00"));
        Page<ListingResponse> priceRangeListings = listingService.getListings(filters);

        // Assert
        assertEquals(2, priceRangeListings.getTotalElements());

        // Act - Filter by query
        filters = new ListingFiltersDto();
        filters.setQuery("python");
        Page<ListingResponse> queryListings = listingService.getListings(filters);

        // Assert
        assertEquals(1, queryListings.getTotalElements());
        assertEquals("Python Programming Book", queryListings.getContent().get(0).getTitle());
    }

    @Test
    void expressInterest_ValidRequest_CreatesConversationAndReservesListing() {
        // Arrange - Create a test listing
        Listing listing = createTestListing("Test Item", "This is a test item", new BigDecimal("15.99"), "miscellaneous");
        ExpressInterestRequest request = new ExpressInterestRequest("I'm interested in buying this item");

        // Act
        Conversation conversation = listingService.expressInterest(listing.getId(), buyer.getId(), request);

        // Assert
        assertNotNull(conversation);
        assertEquals(listing.getId(), conversation.getListing().getId());
        assertEquals(buyer.getId(), conversation.getBuyer().getId());
        assertEquals(seller.getId(), conversation.getSeller().getId());

        // Check that the listing status is now RESERVED
        Listing updatedListing = listingRepository.findById(listing.getId()).orElseThrow();
        assertEquals(Listing.Status.RESERVED, updatedListing.getStatus());
        assertEquals(buyer.getId(), updatedListing.getReservedBy().getId());
    }

    private Listing createTestListing(String title, String description, BigDecimal price, String category) {
        Listing listing = new Listing();
        listing.setTitle(title);
        listing.setDescription(description);
        listing.setPrice(price);
        listing.setCategory(category);
        listing.setSeller(seller);

        List<Listing.ListingImage> images = new ArrayList<>();
        Listing.ListingImage image = new Listing.ListingImage();
        image.setUrl("https://example.com/test.jpg");
        image.setPath("test/test.jpg");
        image.setAlt("Test image");
        images.add(image);
        listing.setImages(images);

        return listingRepository.save(listing);
    }
}
