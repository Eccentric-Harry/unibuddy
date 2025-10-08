package com.unibuddy.collegeBuddy.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unibuddy.collegeBuddy.dto.listing.ListingCreateRequest;
import com.unibuddy.collegeBuddy.entity.College;
import com.unibuddy.collegeBuddy.entity.User;
import com.unibuddy.collegeBuddy.repository.CollegeRepository;
import com.unibuddy.collegeBuddy.repository.ListingRepository;
import com.unibuddy.collegeBuddy.repository.UserRepository;
import com.unibuddy.collegeBuddy.util.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class ListingControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String authToken;
    private User testUser;

    @BeforeEach
    void setUp() {
        // Clean up
        listingRepository.deleteAll();

        // Create test college
        College college = new College();
        college.setName("Test University");
        college.setDomain("test.edu");
        college = collegeRepository.save(college);

        // Create test user
        testUser = new User();
        testUser.setName("Test User");
        testUser.setEmail("testuser@test.edu");
        testUser.setPasswordHash(passwordEncoder.encode("password"));
        testUser.setEmailVerified(true);
        testUser.setCollege(college);
        testUser = userRepository.save(testUser);

        // Generate auth token
        UserDetails userDetails = userDetailsService.loadUserByUsername(testUser.getEmail());
        authToken = jwtUtils.generateToken(userDetails);
    }

    @Test
    void createListing_WithValidJsonPayload_ReturnsCreated() throws Exception {
        // Arrange
        ListingCreateRequest request = new ListingCreateRequest();
        request.setTitle("Test Listing for Sale");
        request.setDescription("This is a detailed test listing description with more than 20 characters.");
        request.setPrice(new BigDecimal("49.99"));
        request.setCategory("electronics");

        List<ListingCreateRequest.ListingImageDto> images = new ArrayList<>();
        ListingCreateRequest.ListingImageDto image = new ListingCreateRequest.ListingImageDto();
        image.setUrl("https://example.com/images/test.jpg");
        image.setPath("test-user/123456-abc.jpg");
        image.setAlt("Test product image");
        images.add(image);
        request.setImages(images);

        // Act & Assert
        mockMvc.perform(post("/api/listings")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.title").value("Test Listing for Sale"))
                .andExpect(jsonPath("$.description").value("This is a detailed test listing description with more than 20 characters."))
                .andExpect(jsonPath("$.price").value(49.99))
                .andExpect(jsonPath("$.category").value("electronics"))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.seller.id").value(testUser.getId().toString()))
                .andExpect(jsonPath("$.images[0].url").value("https://example.com/images/test.jpg"));
    }

    @Test
    void createListing_WithoutAuthentication_ReturnsUnauthorized() throws Exception {
        // Arrange
        ListingCreateRequest request = new ListingCreateRequest();
        request.setTitle("Test Listing");
        request.setDescription("This is a test listing description.");
        request.setPrice(new BigDecimal("29.99"));
        request.setCategory("books");
        request.setImages(new ArrayList<>());

        // Act & Assert
        mockMvc.perform(post("/api/listings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createListing_WithInvalidData_ReturnsBadRequest() throws Exception {
        // Arrange - Missing required fields
        ListingCreateRequest request = new ListingCreateRequest();
        request.setTitle("Short"); // Too short (min 5 chars)
        request.setDescription("Short desc"); // Too short (min 20 chars)
        request.setPrice(new BigDecimal("-10.00")); // Negative price
        request.setCategory("books");
        request.setImages(new ArrayList<>());

        // Act & Assert
        mockMvc.perform(post("/api/listings")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
