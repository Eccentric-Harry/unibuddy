package com.unibuddy.collegeBuddy.controller;

import com.unibuddy.collegeBuddy.dto.listing.*;
import com.unibuddy.collegeBuddy.entity.Conversation;
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
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @PostMapping
    public ResponseEntity<ListingResponse> createListing(
            @Valid @RequestBody ListingCreateRequest request,
            @AuthenticationPrincipal User user) {
        
        ListingResponse response = listingService.createListing(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<ListingResponse>> getListings(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        ListingFiltersDto filters = new ListingFiltersDto();
        filters.setCategory(category);
        filters.setQuery(query);
        filters.setMinPrice(minPrice);
        filters.setMaxPrice(maxPrice);
        filters.setPage(page);
        filters.setSize(size);
        filters.setSort(sort);

        Page<ListingResponse> listings = listingService.getListings(filters);
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse> getListingById(@PathVariable UUID id) {
        ListingResponse listing = listingService.getListingById(id);
        return ResponseEntity.ok(listing);
    }

    @PostMapping("/{id}/express-interest")
    public ResponseEntity<Map<String, Object>> expressInterest(
            @PathVariable UUID id,
            @RequestBody(required = false) ExpressInterestRequest request,
            @AuthenticationPrincipal User user) {

        if (request == null) {
            request = new ExpressInterestRequest();
        }

        Conversation conversation = listingService.expressInterest(id, user.getId(), request);

        Map<String, Object> response = new HashMap<>();
        response.put("conversationId", conversation.getId());
        response.put("message", "Interest expressed successfully");

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ListingResponse> updateListingStatus(
            @PathVariable UUID id,
            @Valid @RequestBody ListingStatusUpdateRequest request,
            @AuthenticationPrincipal User user) {

        ListingResponse listing = listingService.updateListingStatus(id, user.getId(), request);
        return ResponseEntity.ok(listing);
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<Map<String, String>> reportListing(
            @PathVariable UUID id,
            @RequestBody(required = false) Map<String, String> reportData,
            @AuthenticationPrincipal User user) {

        String reason = reportData != null ? reportData.get("reason") : "Not specified";
        listingService.reportListing(id, user.getId(), reason);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Listing reported successfully");
        return ResponseEntity.ok(response);
    }
}
