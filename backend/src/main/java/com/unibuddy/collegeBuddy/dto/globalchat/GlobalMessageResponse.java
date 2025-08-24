package com.unibuddy.collegeBuddy.dto.globalchat;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class GlobalMessageResponse {
    private UUID id;
    private String messageText;
    private String imageUrl;
    private LocalDateTime createdAt;
    private SenderInfo sender;
    private UUID globalChatId;

    @Data
    public static class SenderInfo {
        private UUID id;
        private String name;
        private String avatarUrl;
        private Short year;
    }
}
