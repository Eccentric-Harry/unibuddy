package com.unibuddy.collegeBuddy.dto.message;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class MessageResponse {
    private UUID id;
    private String messageText;
    private String imageUrl;
    private SenderInfo sender;
    private LocalDateTime createdAt;

    @Data
    public static class SenderInfo {
        private UUID id;
        private String name;
        private String avatarUrl;
    }
}
