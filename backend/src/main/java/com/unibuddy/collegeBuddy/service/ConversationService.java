package com.unibuddy.collegeBuddy.service;

import com.unibuddy.collegeBuddy.dto.conversation.ConversationResponse;
import com.unibuddy.collegeBuddy.dto.message.MessageResponse;
import com.unibuddy.collegeBuddy.dto.message.SendMessageRequest;
import com.unibuddy.collegeBuddy.entity.Conversation;
import com.unibuddy.collegeBuddy.entity.Listing;
import com.unibuddy.collegeBuddy.entity.Message;
import com.unibuddy.collegeBuddy.entity.User;
import com.unibuddy.collegeBuddy.repository.ConversationRepository;
import com.unibuddy.collegeBuddy.repository.ListingRepository;
import com.unibuddy.collegeBuddy.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ListingRepository listingRepository;
    private final FileStorageService fileStorageService;
    private final ProfanityFilterService profanityFilterService;
    private final RateLimitService rateLimitService;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public Page<ConversationResponse> getUserConversations(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Conversation> conversations = conversationRepository.findByUserInvolved(userId, pageable);
        
        return conversations.map(conversation -> mapToResponse(conversation, userId));
    }

    @Transactional(readOnly = true)
    public Page<MessageResponse> getConversationMessages(UUID conversationId, UUID userId, int page, int size) {
        // Verify user has access to this conversation
        conversationRepository.findByIdAndUserInvolved(conversationId, userId)
            .orElseThrow(() -> new RuntimeException("Conversation not found or access denied"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId, pageable);
        
        return messages.map(this::mapMessageToResponse);
    }

    @Transactional
    public MessageResponse sendMessage(UUID conversationId, SendMessageRequest request, User sender) {
        // Check rate limit
        if (rateLimitService.isRateLimited(sender.getId())) {
            throw new RuntimeException("Rate limit exceeded. Please wait before sending another message.");
        }

        // Validate user is verified
        if (!sender.getEmailVerified()) {
            throw new IllegalStateException("Only verified users can send messages");
        }

        // Validate content
        profanityFilterService.validateContent(request.getMessageText());

        // Get conversation and verify user has access
        Conversation conversation = conversationRepository.findByIdAndUserInvolved(conversationId, sender.getId())
            .orElseThrow(() -> new RuntimeException("Conversation not found or access denied"));

        // Store image if provided
        String imageUrl = null;
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            imageUrl = fileStorageService.storeChatImage(request.getImage());
        }

        // Create message
        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setMessageText(request.getMessageText());
        message.setImageUrl(imageUrl);

        message = messageRepository.save(message);
        log.info("Message sent in conversation {} by user {}", conversationId, sender.getId());

        // Update conversation timestamp
        conversation.setUpdatedAt(message.getCreatedAt());
        conversationRepository.save(conversation);

        // Send via WebSocket
        MessageResponse response = mapMessageToResponse(message);
        messagingTemplate.convertAndSend("/topic/conversations/" + conversationId, response);

        return response;
    }

    @Transactional
    public ConversationResponse getOrCreateConversation(UUID listingId, User buyer) {
        // Validate user is verified
        if (!buyer.getEmailVerified()) {
            throw new IllegalStateException("Only verified users can start conversations");
        }

        Listing listing = listingRepository.findById(listingId)
            .orElseThrow(() -> new RuntimeException("Listing not found"));

        // Check if buyer is trying to message themselves
        if (listing.getSeller().getId().equals(buyer.getId())) {
            throw new IllegalArgumentException("Cannot start conversation with yourself");
        }

        // Try to find existing conversation
        Optional<Conversation> existingConversation = conversationRepository.findByListingIdAndBuyerId(listingId, buyer.getId());
        
        if (existingConversation.isPresent()) {
            return mapToResponse(existingConversation.get(), buyer.getId());
        }

        // Create new conversation
        Conversation conversation = new Conversation();
        conversation.setListing(listing);
        conversation.setBuyer(buyer);
        conversation.setSeller(listing.getSeller());

        conversation = conversationRepository.save(conversation);
        log.info("Created conversation {} for listing {} between buyer {} and seller {}", 
            conversation.getId(), listingId, buyer.getId(), listing.getSeller().getId());

        return mapToResponse(conversation, buyer.getId());
    }

    private ConversationResponse mapToResponse(Conversation conversation, UUID currentUserId) {
        ConversationResponse response = new ConversationResponse();
        response.setId(conversation.getId());
        response.setCreatedAt(conversation.getCreatedAt());
        response.setUpdatedAt(conversation.getUpdatedAt());

        // Map listing info
        ConversationResponse.ListingInfo listingInfo = new ConversationResponse.ListingInfo();
        listingInfo.setId(conversation.getListing().getId());
        listingInfo.setTitle(conversation.getListing().getTitle());
        if (conversation.getListing().getImages() != null && !conversation.getListing().getImages().isEmpty()) {
            listingInfo.setFirstImage(conversation.getListing().getImages().get(0));
        }
        response.setListing(listingInfo);

        // Map other user info (the user who is not the current user)
        User otherUser = conversation.getBuyer().getId().equals(currentUserId) 
            ? conversation.getSeller() 
            : conversation.getBuyer();
        
        ConversationResponse.UserInfo userInfo = new ConversationResponse.UserInfo();
        userInfo.setId(otherUser.getId());
        userInfo.setName(otherUser.getName());
        userInfo.setAvatarUrl(otherUser.getAvatarUrl());
        response.setOtherUser(userInfo);

        // Map last message if exists
        Optional<Message> lastMessage = messageRepository.findLatestByConversationId(conversation.getId());
        if (lastMessage.isPresent()) {
            ConversationResponse.MessageInfo messageInfo = new ConversationResponse.MessageInfo();
            messageInfo.setMessageText(lastMessage.get().getMessageText());
            messageInfo.setCreatedAt(lastMessage.get().getCreatedAt());
            messageInfo.setFromCurrentUser(lastMessage.get().getSender().getId().equals(currentUserId));
            response.setLastMessage(messageInfo);
        }

        return response;
    }

    private MessageResponse mapMessageToResponse(Message message) {
        MessageResponse response = new MessageResponse();
        response.setId(message.getId());
        response.setMessageText(message.getMessageText());
        response.setImageUrl(message.getImageUrl());
        response.setCreatedAt(message.getCreatedAt());

        MessageResponse.SenderInfo senderInfo = new MessageResponse.SenderInfo();
        senderInfo.setId(message.getSender().getId());
        senderInfo.setName(message.getSender().getName());
        senderInfo.setAvatarUrl(message.getSender().getAvatarUrl());
        response.setSender(senderInfo);

        return response;
    }
}
