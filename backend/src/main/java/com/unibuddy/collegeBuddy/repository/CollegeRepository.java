package com.unibuddy.collegeBuddy.repository;

import com.unibuddy.collegeBuddy.entity.College;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollegeRepository extends JpaRepository<College, Long> {
    Optional<College> findByDomain(String domain);
    Optional<College> findByName(String name);
    boolean existsByDomain(String domain);
    
    // Search methods
    List<College> findByNameContainingIgnoreCaseOrDomainContainingIgnoreCase(
        String name, String domain, Pageable pageable);
    
    // Verification methods
    Page<College> findByVerifiedTrue(Pageable pageable);
    Page<College> findByVerifiedFalse(Pageable pageable);
    
    // Additional useful methods
    List<College> findByVerifiedTrueOrderByNameAsc();
    List<College> findByNameContainingIgnoreCase(String name);
    List<College> findByDomainContainingIgnoreCase(String domain);
}
