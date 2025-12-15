package com.unibuddy.collegeBuddy.controller;

import com.unibuddy.collegeBuddy.dto.CreateTutoringListingRequest;
import com.unibuddy.collegeBuddy.dto.TutoringListingDTO;
import com.unibuddy.collegeBuddy.entity.TutoringListing;
import com.unibuddy.collegeBuddy.entity.User;
import com.unibuddy.collegeBuddy.service.TutoringListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tutoring")
@RequiredArgsConstructor
public class TutoringListingController {

    private final TutoringListingService tutoringListingService;

    @PostMapping
    public ResponseEntity<TutoringListingDTO> createListing(
            @AuthenticationPrincipal User user,
            @RequestBody CreateTutoringListingRequest request
    ) {
        TutoringListingDTO listing = tutoringListingService.createListing(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(listing);
    }

    @GetMapping
    public ResponseEntity<Page<TutoringListingDTO>> getListings(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String query,
            @RequestParam(required = false, defaultValue = "ACTIVE") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        Page<TutoringListingDTO> listings = tutoringListingService.getListings(
                minPrice, maxPrice, subject, query, status, page, size, sort
        );
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TutoringListingDTO> getListingById(@PathVariable UUID id) {
        TutoringListingDTO listing = tutoringListingService.getListingById(id);
        return ResponseEntity.ok(listing);
    }

    @GetMapping("/my-listings")
    public ResponseEntity<List<TutoringListingDTO>> getMyListings(
            @AuthenticationPrincipal User user
    ) {
        List<TutoringListingDTO> listings = tutoringListingService.getMyListings(user.getId());
        return ResponseEntity.ok(listings);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TutoringListingDTO> updateListing(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user,
            @RequestBody CreateTutoringListingRequest request
    ) {
        TutoringListingDTO listing = tutoringListingService.updateListing(id, user.getId(), request);
        return ResponseEntity.ok(listing);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TutoringListingDTO> updateStatus(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user,
            @RequestParam TutoringListing.Status status
    ) {
        TutoringListingDTO listing = tutoringListingService.updateStatus(id, user.getId(), status);
        return ResponseEntity.ok(listing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        tutoringListingService.deleteListing(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}

