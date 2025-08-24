package com.unibuddy.collegeBuddy.dto.conversation;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ConversationResponse {
    private UUID id;
    private ListingInfo listing;
    private UserInfo otherUser;
    private MessageInfo lastMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class ListingInfo {
        private UUID id;
        private String title;
        private String firstImage;
    }

    @Data
    public static class UserInfo {
        private UUID id;
        private String name;
        private String avatarUrl;
    }

    @Data
    public static class MessageInfo {
        private String messageText;
        private LocalDateTime createdAt;
        private boolean fromCurrentUser;
    }
}
