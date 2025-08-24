package com.unibuddy.collegeBuddy.service;

import com.unibuddy.collegeBuddy.dto.message.MessageResponse;
import com.unibuddy.collegeBuddy.dto.message.SendMessageRequest;
import com.unibuddy.collegeBuddy.entity.Listing;
import com.unibuddy.collegeBuddy.entity.User;
import com.unibuddy.collegeBuddy.repository.ConversationRepository;
import com.unibuddy.collegeBuddy.repository.ListingRepository;
import com.unibuddy.collegeBuddy.repository.MessageRepository;
import com.unibuddy.collegeBuddy.repository.UserRepository;
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
public class ConversationServiceIntegrationTest {

    @Autowired
    private ConversationService conversationService;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private UserRepository userRepository;

    private User seller;
    private User buyer;
    private Listing listing;

    @BeforeEach
    void setUp() {
        // Create seller
        seller = new User();
        seller.setName("Seller User");
        seller.setEmail("seller@example.com");
        seller.setPasswordHash("hashedPassword");
        seller.setEmailVerified(true);
        seller.setRole(User.Role.STUDENT);
        seller = userRepository.save(seller);

        // Create buyer
        buyer = new User();
        buyer.setName("Buyer User");
        buyer.setEmail("buyer@example.com");
        buyer.setPasswordHash("hashedPassword");
        buyer.setEmailVerified(true);
        buyer.setRole(User.Role.STUDENT);
        buyer = userRepository.save(buyer);

        // Create listing
        listing = new Listing();
        listing.setTitle("Test Book");
        listing.setDescription("A great textbook");
        listing.setPrice(new BigDecimal("50.00"));
        listing.setCategory("Books");
        listing.setSeller(seller);
        listing = listingRepository.save(listing);
    }

    @Test
    void testGetOrCreateConversation() {
        // When
        var response = conversationService.getOrCreateConversation(listing.getId(), buyer);

        // Then
        assertNotNull(response);
        assertNotNull(response.getId());
        assertEquals(listing.getId(), response.getListing().getId());
        assertEquals(seller.getId(), response.getOtherUser().getId());

        // Verify conversation was created in database
        var conversations = conversationRepository.findByListingIdAndBuyerId(listing.getId(), buyer.getId());
        assertTrue(conversations.isPresent());
    }

    @Test
    void testSendMessage() {
        // Given - Create conversation first
        var conversationResponse = conversationService.getOrCreateConversation(listing.getId(), buyer);
        
        SendMessageRequest request = new SendMessageRequest();
        request.setMessageText("Hi, is this item still available?");

        // When
        MessageResponse messageResponse = conversationService.sendMessage(conversationResponse.getId(), request, buyer);

        // Then
        assertNotNull(messageResponse);
        assertNotNull(messageResponse.getId());
        assertEquals("Hi, is this item still available?", messageResponse.getMessageText());
        assertEquals(buyer.getId(), messageResponse.getSender().getId());

        // Verify message was saved to database
        var messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationResponse.getId(), null);
        assertEquals(1, messages.getTotalElements());
    }

    @Test
    void testSendMessageWithUnverifiedUser() {
        // Given
        buyer.setEmailVerified(false);
        var conversationResponse = conversationService.getOrCreateConversation(listing.getId(), seller); // Use seller to create conversation first
        
        SendMessageRequest request = new SendMessageRequest();
        request.setMessageText("Test message");

        // When & Then
        assertThrows(IllegalStateException.class, () -> {
            conversationService.sendMessage(conversationResponse.getId(), request, buyer);
        });
    }
}
