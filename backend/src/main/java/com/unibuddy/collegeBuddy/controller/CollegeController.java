package com.unibuddy.collegeBuddy.controller;

import com.unibuddy.collegeBuddy.entity.College;
import com.unibuddy.collegeBuddy.repository.CollegeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colleges")
@RequiredArgsConstructor
public class CollegeController {

    private final CollegeRepository collegeRepository;

    @GetMapping
    public ResponseEntity<Page<College>> getAllColleges(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<College> colleges = collegeRepository.findAll(pageable);
        
        return ResponseEntity.ok(colleges);
    }

    @GetMapping("/all")
    public ResponseEntity<List<College>> getAllCollegesList() {
        List<College> colleges = collegeRepository.findAll();
        return ResponseEntity.ok(colleges);
    }

    @GetMapping("/{id}")
    public ResponseEntity<College> getCollegeById(@PathVariable Long id) {
        return collegeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/domain/{domain}")
    public ResponseEntity<College> getCollegeByDomain(@PathVariable String domain) {
        return collegeRepository.findByDomain(domain)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<College>> searchColleges(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<College> colleges = collegeRepository.findByNameContainingIgnoreCaseOrDomainContainingIgnoreCase(
            query, query, PageRequest.of(0, limit));
        return ResponseEntity.ok(colleges);
    }
    
    @GetMapping("/verified")
    public ResponseEntity<Page<College>> getVerifiedColleges(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<College> colleges = collegeRepository.findByVerifiedTrue(pageable);
        
        return ResponseEntity.ok(colleges);
    }
    
    @GetMapping("/count")
    public ResponseEntity<Long> getCollegeCount() {
        long count = collegeRepository.count();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/validate-domain/{domain}")
    public ResponseEntity<Boolean> validateDomain(@PathVariable String domain) {
        boolean exists = collegeRepository.existsByDomain(domain);
        return ResponseEntity.ok(exists);
    }
}
