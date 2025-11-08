package com.unibuddy.collegeBuddy.service;

import com.unibuddy.collegeBuddy.dto.JobPostingDTO;
import com.unibuddy.collegeBuddy.entity.JobPosting;
import com.unibuddy.collegeBuddy.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;

    @Transactional(readOnly = true)
    public Page<JobPostingDTO> getJobs(String jobType, String locationType, String query,
                                       int page, int size, String sort) {

        Pageable pageable = createPageable(page, size, sort);

        JobPosting.JobType jobTypeEnum = parseJobType(jobType);
        JobPosting.LocationType locationTypeEnum = parseLocationType(locationType);

        Page<JobPosting> jobPage;

        if (query != null && !query.isEmpty()) {
            jobPage = jobPostingRepository.findByFiltersAndSearch(
                    JobPosting.JobStatus.ACTIVE,
                    jobTypeEnum,
                    locationTypeEnum,
                    query,
                    pageable
            );
        } else {
            jobPage = jobPostingRepository.findByFilters(
                    JobPosting.JobStatus.ACTIVE,
                    jobTypeEnum,
                    locationTypeEnum,
                    pageable
            );
        }

        return jobPage.map(JobPostingDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public JobPostingDTO getJobById(String id) {
        JobPosting job = jobPostingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        return JobPostingDTO.fromEntity(job);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getJobStats() {
        Map<String, Long> stats = new HashMap<>();

        stats.put("total", jobPostingRepository.countByStatus(JobPosting.JobStatus.ACTIVE));
        stats.put("internships", jobPostingRepository.countByStatusAndJobType(
                JobPosting.JobStatus.ACTIVE, JobPosting.JobType.INTERNSHIP));
        stats.put("fullTime", jobPostingRepository.countByStatusAndJobType(
                JobPosting.JobStatus.ACTIVE, JobPosting.JobType.FULL_TIME));
        stats.put("partTime", jobPostingRepository.countByStatusAndJobType(
                JobPosting.JobStatus.ACTIVE, JobPosting.JobType.PART_TIME));
        stats.put("remote", jobPostingRepository.countByStatusAndLocationType(
                JobPosting.JobStatus.ACTIVE, JobPosting.LocationType.REMOTE));

        return stats;
    }

    private Pageable createPageable(int page, int size, String sort) {
        if (sort != null && !sort.isEmpty()) {
            String[] sortParams = sort.split(",");
            String field = sortParams[0];
            Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc")
                    ? Sort.Direction.DESC : Sort.Direction.ASC;
            return PageRequest.of(page, size, Sort.by(direction, field));
        }
        return PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    private JobPosting.JobType parseJobType(String jobType) {
        if (jobType == null || jobType.isEmpty()) return null;

        try {
            // Handle display names
            return switch (jobType) {
                case "Full-time" -> JobPosting.JobType.FULL_TIME;
                case "Part-time" -> JobPosting.JobType.PART_TIME;
                case "Internship" -> JobPosting.JobType.INTERNSHIP;
                case "Contract" -> JobPosting.JobType.CONTRACT;
                default -> JobPosting.JobType.valueOf(jobType.toUpperCase().replace("-", "_"));
            };
        } catch (IllegalArgumentException e) {
            log.warn("Invalid job type: {}", jobType);
            return null;
        }
    }

    private JobPosting.LocationType parseLocationType(String locationType) {
        if (locationType == null || locationType.isEmpty()) return null;

        try {
            // Handle display names
            return switch (locationType) {
                case "On-site" -> JobPosting.LocationType.ON_SITE;
                case "Remote" -> JobPosting.LocationType.REMOTE;
                case "Hybrid" -> JobPosting.LocationType.HYBRID;
                default -> JobPosting.LocationType.valueOf(locationType.toUpperCase().replace("-", "_"));
            };
        } catch (IllegalArgumentException e) {
            log.warn("Invalid location type: {}", locationType);
            return null;
        }
    }
}

