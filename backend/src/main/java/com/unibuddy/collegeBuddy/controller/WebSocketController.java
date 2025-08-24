package com.unibuddy.collegeBuddy.controller;

import com.unibuddy.collegeBuddy.dto.globalchat.SendGlobalMessageRequest;
import com.unibuddy.collegeBuddy.dto.message.SendMessageRequest;
import com.unibuddy.collegeBuddy.entity.User;
import com.unibuddy.collegeBuddy.service.ConversationService;
import com.unibuddy.collegeBuddy.service.GlobalChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final ConversationService conversationService;
    private final GlobalChatService globalChatService;

    @MessageMapping("/conversations/{conversationId}")
    public void sendMessage(
            @DestinationVariable UUID conversationId,
            @Payload SendMessageRequest message,
            SimpMessageHeaderAccessor headerAccessor) {
        
        // Get user from session (this would need proper WebSocket authentication setup)
        var sessionAttributes = headerAccessor.getSessionAttributes();
        if (sessionAttributes != null) {
            User user = (User) sessionAttributes.get("user");
            
            if (user != null) {
                conversationService.sendMessage(conversationId, message, user);
                // Message is automatically sent via WebSocket in the service
            }
        }
    }

    @MessageMapping("/global-chat/{globalChatId}")
    public void sendGlobalMessage(
            @DestinationVariable UUID globalChatId,
            @Payload SendGlobalMessageRequest message,
            SimpMessageHeaderAccessor headerAccessor) {
        
        // Get user from session (this would need proper WebSocket authentication setup)
        var sessionAttributes = headerAccessor.getSessionAttributes();
        if (sessionAttributes != null) {
            User user = (User) sessionAttributes.get("user");
            
            if (user != null) {
                globalChatService.sendGlobalMessage(globalChatId, message, user);
                // Message is automatically sent via WebSocket in the service
            }
        }
    }
}
