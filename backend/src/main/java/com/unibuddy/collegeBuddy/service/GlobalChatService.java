package com.unibuddy.collegeBuddy.service;

import com.unibuddy.collegeBuddy.dto.globalchat.GlobalChatResponse;
import com.unibuddy.collegeBuddy.dto.globalchat.GlobalMessageResponse;
import com.unibuddy.collegeBuddy.dto.globalchat.SendGlobalMessageRequest;
import com.unibuddy.collegeBuddy.entity.GlobalChat;
import com.unibuddy.collegeBuddy.entity.GlobalMessage;
import com.unibuddy.collegeBuddy.entity.User;
import com.unibuddy.collegeBuddy.repository.GlobalChatRepository;
import com.unibuddy.collegeBuddy.repository.GlobalMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GlobalChatService {

    private final GlobalChatRepository globalChatRepository;
    private final GlobalMessageRepository globalMessageRepository;
    private final FileStorageService fileStorageService;
    private final ProfanityFilterService profanityFilterService;
    private final RateLimitService rateLimitService;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public List<GlobalChatResponse> getCollegeChats(Long collegeId) {
        List<GlobalChat> chats = globalChatRepository.findByCollegeIdAndIsActiveTrue(collegeId);
        
        return chats.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<GlobalMessageResponse> getGlobalChatMessages(UUID globalChatId, User user, int page, int size) {
        // Verify user has access to this global chat (same college)
        GlobalChat globalChat = globalChatRepository.findById(globalChatId)
                .orElseThrow(() -> new RuntimeException("Global chat not found"));

        if (user.getCollege() == null || !user.getCollege().getId().equals(globalChat.getCollege().getId())) {
            throw new RuntimeException("Access denied: You can only access chats from your college");
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<GlobalMessage> messages = globalMessageRepository.findByGlobalChatIdOrderByCreatedAtAsc(globalChatId, pageable);
        
        return messages.map(this::mapMessageToResponse);
    }

    @Transactional
    public GlobalMessageResponse sendGlobalMessage(UUID globalChatId, SendGlobalMessageRequest request, User sender) {
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

        // Get global chat and verify user has access
        GlobalChat globalChat = globalChatRepository.findById(globalChatId)
                .orElseThrow(() -> new RuntimeException("Global chat not found"));

        if (sender.getCollege() == null || !sender.getCollege().getId().equals(globalChat.getCollege().getId())) {
            throw new RuntimeException("Access denied: You can only send messages to chats from your college");
        }

        // Store image if provided
        String imageUrl = null;
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            imageUrl = fileStorageService.storeChatImage(request.getImage());
        }

        // Create message
        GlobalMessage message = new GlobalMessage();
        message.setGlobalChat(globalChat);
        message.setSender(sender);
        message.setMessageText(request.getMessageText());
        message.setImageUrl(imageUrl);

        message = globalMessageRepository.save(message);
        log.info("Global message sent in chat {} by user {}", globalChatId, sender.getId());

        // Send via WebSocket to all users subscribed to this global chat
        GlobalMessageResponse response = mapMessageToResponse(message);
        messagingTemplate.convertAndSend("/topic/global-chat/" + globalChatId, response);

        return response;
    }

    private GlobalChatResponse mapToResponse(GlobalChat globalChat) {
        GlobalChatResponse response = new GlobalChatResponse();
        response.setId(globalChat.getId());
        response.setName(globalChat.getName());
        response.setDescription(globalChat.getDescription());
        response.setIsActive(globalChat.getIsActive());
        response.setCreatedAt(globalChat.getCreatedAt());
        response.setCollegeId(globalChat.getCollege().getId());
        response.setCollegeName(globalChat.getCollege().getName());

        // Get last message
        Optional<GlobalMessage> lastMessage = globalMessageRepository.findLatestByGlobalChatId(globalChat.getId());
        if (lastMessage.isPresent()) {
            GlobalChatResponse.MessageInfo messageInfo = new GlobalChatResponse.MessageInfo();
            messageInfo.setMessageText(lastMessage.get().getMessageText());
            messageInfo.setCreatedAt(lastMessage.get().getCreatedAt());
            messageInfo.setSenderName(lastMessage.get().getSender().getName());
            messageInfo.setSenderId(lastMessage.get().getSender().getId());
            response.setLastMessage(messageInfo);
        }

        // Count messages (for future use)
        response.setMessageCount(globalMessageRepository.count());

        return response;
    }

    private GlobalMessageResponse mapMessageToResponse(GlobalMessage message) {
        GlobalMessageResponse response = new GlobalMessageResponse();
        response.setId(message.getId());
        response.setMessageText(message.getMessageText());
        response.setImageUrl(message.getImageUrl());
        response.setCreatedAt(message.getCreatedAt());
        response.setGlobalChatId(message.getGlobalChat().getId());

        GlobalMessageResponse.SenderInfo senderInfo = new GlobalMessageResponse.SenderInfo();
        senderInfo.setId(message.getSender().getId());
        senderInfo.setName(message.getSender().getName());
        senderInfo.setAvatarUrl(message.getSender().getAvatarUrl());
        senderInfo.setYear(message.getSender().getYear());
        response.setSender(senderInfo);

        return response;
    }
}
