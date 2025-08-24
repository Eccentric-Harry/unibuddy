package com.unibuddy.collegeBuddy.dto.listing;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class ListingResponse {
    private UUID id;
    private String title;
    private String description;
    private BigDecimal price;
    private String category;
    private List<String> images;
    private String status;
    private SellerInfo seller;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class SellerInfo {
        private UUID id;
        private String name;
        private String avatarUrl;
        private Short year;
        private String collegeName;
    }
}
