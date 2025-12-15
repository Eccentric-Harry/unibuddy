package com.unibuddy.collegeBuddy.dto.listing;

import com.unibuddy.collegeBuddy.entity.Listing.ListingImage;
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
    private String condition;
    private Short year;
    private String registrationNo;
    private List<ListingImage> images;
    private String status;
    private SellerInfo seller;
    private UserInfo reservedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class SellerInfo {
        private UUID id;
        private String name;
        private String avatarUrl;
        private String email;
        private Short year;
        private String collegeName;
        private String registrationNo;
        private String hostel;
    }

    @Data
    public static class UserInfo {
        private UUID id;
        private String name;
        private String avatarUrl;
    }
}
