package com.unibuddy.collegeBuddy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "job_postings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String companyName;

    private String companyLogo;
    private String companyWebsite;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LocationType locationType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobType jobType;

    @Column(length = 5000)
    private String description;

    @ElementCollection
    @CollectionTable(name = "job_requirements", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "requirement", length = 1000)
    private List<String> requirements;

    @ElementCollection
    @CollectionTable(name = "job_responsibilities", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "responsibility", length = 1000)
    private List<String> responsibilities;

    @ElementCollection
    @CollectionTable(name = "job_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")
    private List<String> skills;

    private Integer salaryMin;
    private Integer salaryMax;
    private String salaryCurrency;

    @Enumerated(EnumType.STRING)
    private SalaryPeriod salaryPeriod;

    private LocalDateTime applicationDeadline;

    @Column(length = 1000)
    private String applicationUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status;

    private String externalJobId; // ID from the external API
    private String externalSource; // e.g., "jsearch", "adzuna"

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime lastSyncedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum LocationType {
        ON_SITE("On-site"),
        REMOTE("Remote"),
        HYBRID("Hybrid");

        private final String displayName;

        LocationType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum JobType {
        FULL_TIME("Full-time"),
        PART_TIME("Part-time"),
        INTERNSHIP("Internship"),
        CONTRACT("Contract");

        private final String displayName;

        JobType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum SalaryPeriod {
        HOURLY,
        MONTHLY,
        YEARLY
    }

    public enum JobStatus {
        ACTIVE,
        CLOSED,
        DRAFT
    }
}

