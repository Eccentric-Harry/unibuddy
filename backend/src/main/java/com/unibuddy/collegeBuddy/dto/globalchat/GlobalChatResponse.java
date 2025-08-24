package com.unibuddy.collegeBuddy.dto.globalchat;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class GlobalChatResponse {
    private UUID id;
    private String name;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private Long collegeId;
    private String collegeName;
    private MessageInfo lastMessage;
    private Long messageCount;

    @Data
    public static class MessageInfo {
        private String messageText;
        private LocalDateTime createdAt;
        private String senderName;
        private UUID senderId;
    }
}
