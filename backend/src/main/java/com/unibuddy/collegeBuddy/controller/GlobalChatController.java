package com.unibuddy.collegeBuddy.controller;

import com.unibuddy.collegeBuddy.dto.globalchat.GlobalChatResponse;
import com.unibuddy.collegeBuddy.dto.globalchat.GlobalMessageResponse;
import com.unibuddy.collegeBuddy.dto.globalchat.SendGlobalMessageRequest;
import com.unibuddy.collegeBuddy.entity.User;
import com.unibuddy.collegeBuddy.service.GlobalChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/global-chats")
@RequiredArgsConstructor
public class GlobalChatController {

    private final GlobalChatService globalChatService;

    @GetMapping
    public ResponseEntity<List<GlobalChatResponse>> getCollegeChats(@AuthenticationPrincipal User user) {
        if (user.getCollege() == null) {
            throw new RuntimeException("User must be associated with a college to access global chats");
        }
        
        List<GlobalChatResponse> chats = globalChatService.getCollegeChats(user.getCollege().getId());
        return ResponseEntity.ok(chats);
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<Page<GlobalMessageResponse>> getGlobalChatMessages(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @AuthenticationPrincipal User user) {
        
        Page<GlobalMessageResponse> messages = globalChatService.getGlobalChatMessages(id, user, page, size);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<GlobalMessageResponse> sendGlobalMessage(
            @PathVariable UUID id,
            @Valid @ModelAttribute SendGlobalMessageRequest request,
            @AuthenticationPrincipal User user) {
        
        GlobalMessageResponse response = globalChatService.sendGlobalMessage(id, request, user);
        return ResponseEntity.ok(response);
    }
}
