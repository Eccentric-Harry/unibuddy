package com.unibuddy.collegeBuddy.repository;

import com.unibuddy.collegeBuddy.entity.JobPosting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, String> {

    Optional<JobPosting> findByExternalJobId(String externalJobId);

    Page<JobPosting> findByStatus(JobPosting.JobStatus status, Pageable pageable);

    @Query("SELECT j FROM JobPosting j WHERE j.status = :status " +
            "AND (:jobType IS NULL OR j.jobType = :jobType) " +
            "AND (:locationType IS NULL OR j.locationType = :locationType)")
    Page<JobPosting> findByFilters(
            @Param("status") JobPosting.JobStatus status,
            @Param("jobType") JobPosting.JobType jobType,
            @Param("locationType") JobPosting.LocationType locationType,
            Pageable pageable
    );

    @Query("SELECT j FROM JobPosting j WHERE j.status = :status " +
            "AND (LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(j.companyName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(j.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<JobPosting> searchJobs(
            @Param("status") JobPosting.JobStatus status,
            @Param("query") String query,
            Pageable pageable
    );

    @Query("SELECT j FROM JobPosting j WHERE j.status = :status " +
            "AND (:jobType IS NULL OR j.jobType = :jobType) " +
            "AND (:locationType IS NULL OR j.locationType = :locationType) " +
            "AND (:query IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(j.companyName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(j.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<JobPosting> findByFiltersAndSearch(
            @Param("status") JobPosting.JobStatus status,
            @Param("jobType") JobPosting.JobType jobType,
            @Param("locationType") JobPosting.LocationType locationType,
            @Param("query") String query,
            Pageable pageable
    );

    List<JobPosting> findByExternalSource(String externalSource);

    long countByStatus(JobPosting.JobStatus status);

    long countByStatusAndJobType(JobPosting.JobStatus status, JobPosting.JobType jobType);

    long countByStatusAndLocationType(JobPosting.JobStatus status, JobPosting.LocationType locationType);
}

