package com.unibuddy.collegeBuddy.controller;

import com.unibuddy.collegeBuddy.dto.conversation.ConversationResponse;
import com.unibuddy.collegeBuddy.dto.message.MessageResponse;
import com.unibuddy.collegeBuddy.dto.message.SendMessageRequest;
import com.unibuddy.collegeBuddy.entity.User;
import com.unibuddy.collegeBuddy.service.ConversationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
@Slf4j
public class ConversationController {

    private final ConversationService conversationService;

    @GetMapping
    public ResponseEntity<Page<ConversationResponse>> getUserConversations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal User user) {
        
        log.info("Getting conversations for user: {} (page: {}, size: {})", user.getEmail(), page, size);
        Page<ConversationResponse> conversations = conversationService.getUserConversations(user.getId(), page, size);
        log.info("Found {} conversations for user: {}", conversations.getTotalElements(), user.getEmail());
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<Page<MessageResponse>> getConversationMessages(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @AuthenticationPrincipal User user) {
        
        Page<MessageResponse> messages = conversationService.getConversationMessages(id, user.getId(), page, size);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable UUID id,
            @Valid @ModelAttribute SendMessageRequest request,
            @AuthenticationPrincipal User user) {
        
        MessageResponse response = conversationService.sendMessage(id, request, user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/start/{listingId}")
    public ResponseEntity<ConversationResponse> startConversation(
            @PathVariable UUID listingId,
            @AuthenticationPrincipal User user) {
        
        ConversationResponse response = conversationService.getOrCreateConversation(listingId, user);
        return ResponseEntity.ok(response);
    }
}
