package com.unibuddy.collegeBuddy.dto;

import com.unibuddy.collegeBuddy.entity.JobPosting;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPostingDTO {

    private String id;
    private String title;
    private CompanyDTO company;
    private String location;
    private String locationType;
    private String jobType;
    private String description;
    private List<String> requirements;
    private List<String> responsibilities;
    private List<String> skills;
    private SalaryDTO salary;
    private String applicationDeadline;
    private PostedByDTO postedBy;
    private String applicationUrl;
    private String status;
    private String createdAt;
    private String updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CompanyDTO {
        private String id;
        private String name;
        private String logo;
        private String website;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SalaryDTO {
        private Integer min;
        private Integer max;
        private String currency;
        private String period;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PostedByDTO {
        private String id;
        private String name;
        private String role;
    }

    public static JobPostingDTO fromEntity(JobPosting job) {
        JobPostingDTOBuilder builder = JobPostingDTO.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(CompanyDTO.builder()
                        .id(job.getId())
                        .name(job.getCompanyName())
                        .logo(job.getCompanyLogo())
                        .website(job.getCompanyWebsite())
                        .build())
                .location(job.getLocation())
                .locationType(job.getLocationType().getDisplayName())
                .jobType(job.getJobType().getDisplayName())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .responsibilities(job.getResponsibilities())
                .skills(job.getSkills())
                .applicationUrl(job.getApplicationUrl())
                .status(job.getStatus().name())
                .createdAt(job.getCreatedAt().toString())
                .updatedAt(job.getUpdatedAt().toString());

        if (job.getSalaryMin() != null || job.getSalaryMax() != null) {
            builder.salary(SalaryDTO.builder()
                    .min(job.getSalaryMin())
                    .max(job.getSalaryMax())
                    .currency(job.getSalaryCurrency() != null ? job.getSalaryCurrency() : "USD")
                    .period(job.getSalaryPeriod() != null ? job.getSalaryPeriod().name().toLowerCase() : "yearly")
                    .build());
        }

        if (job.getApplicationDeadline() != null) {
            builder.applicationDeadline(job.getApplicationDeadline().toString());
        }

        builder.postedBy(PostedByDTO.builder()
                .id("system")
                .name("UniBuddy Job Board")
                .role("Automated System")
                .build());

        return builder.build();
    }
}

