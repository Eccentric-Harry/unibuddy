package com.unibuddy.collegeBuddy.controller;

import com.unibuddy.collegeBuddy.dto.listing.CreateListingRequest;
import com.unibuddy.collegeBuddy.dto.listing.ListingFilters;
import com.unibuddy.collegeBuddy.dto.listing.ListingResponse;
import com.unibuddy.collegeBuddy.entity.User;
import com.unibuddy.collegeBuddy.service.ListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @PostMapping
    public ResponseEntity<ListingResponse> createListing(
            @Valid @ModelAttribute CreateListingRequest request,
            @AuthenticationPrincipal User user) {
        
        ListingResponse response = listingService.createListing(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<ListingResponse>> getListings(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "DESC") String direction) {
        
        ListingFilters filters = new ListingFilters();
        filters.setCategory(category);
        filters.setQ(q);
        filters.setMinPrice(minPrice);
        filters.setMaxPrice(maxPrice);
        filters.setPage(page);
        filters.setSize(size);
        filters.setSort(sort);
        filters.setDirection(direction);

        Page<ListingResponse> listings = listingService.getListings(filters);
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse> getListingById(@PathVariable UUID id) {
        ListingResponse listing = listingService.getListingById(id);
        return ResponseEntity.ok(listing);
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<Void> reportListing(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        // TODO: Implement reporting functionality
        return ResponseEntity.ok().build();
    }
}
