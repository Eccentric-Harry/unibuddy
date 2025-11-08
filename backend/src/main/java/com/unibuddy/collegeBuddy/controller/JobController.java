package com.unibuddy.collegeBuddy.controller;

import com.unibuddy.collegeBuddy.dto.JobPostingDTO;
import com.unibuddy.collegeBuddy.service.JobPostingService;
import com.unibuddy.collegeBuddy.service.JobSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.frontend-url}")
public class JobController {

    private final JobPostingService jobPostingService;
    private final JobSyncService jobSyncService;

    @GetMapping
    public ResponseEntity<Page<JobPostingDTO>> getJobs(
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String locationType,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        log.info("Fetching jobs with filters - jobType: {}, locationType: {}, query: {}, page: {}, size: {}",
                jobType, locationType, query, page, size);

        Page<JobPostingDTO> jobs = jobPostingService.getJobs(jobType, locationType, query, page, size, sort);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobPostingDTO> getJobById(@PathVariable String id) {
        log.info("Fetching job with id: {}", id);
        JobPostingDTO job = jobPostingService.getJobById(id);
        return ResponseEntity.ok(job);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getJobStats() {
        log.info("Fetching job statistics");
        Map<String, Long> stats = jobPostingService.getJobStats();
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, String>> syncJobs() {
        log.info("Manual job sync triggered");
        try {
            jobSyncService.syncJobs();
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Job sync initiated successfully"
            ));
        } catch (Exception e) {
            log.error("Error during manual job sync", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", "Failed to sync jobs: " + e.getMessage()
            ));
        }
    }
}

