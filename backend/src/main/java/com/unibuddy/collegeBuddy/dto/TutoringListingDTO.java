package com.unibuddy.collegeBuddy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TutoringListingDTO {

    private UUID id;
    private String title;
    private String description;
    private BigDecimal hourlyRate;
    private List<SubjectDTO> subjects;
    private List<String> syllabus;
    private List<String> availability;
    private String status;
    private TutorInfoDTO tutor;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SubjectDTO {
        private String id;
        private String name;
        private String iconUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TutorInfoDTO {
        private UUID id;
        private String name;
        private String avatarUrl;
        private Integer year;
        private String collegeName;
        private String major;
        private Double rating;
        private Integer totalReviews;
    }
}

