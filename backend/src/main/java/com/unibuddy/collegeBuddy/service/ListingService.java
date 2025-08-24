package com.unibuddy.collegeBuddy.service;

import com.unibuddy.collegeBuddy.dto.listing.CreateListingRequest;
import com.unibuddy.collegeBuddy.dto.listing.ListingFilters;
import com.unibuddy.collegeBuddy.dto.listing.ListingResponse;
import com.unibuddy.collegeBuddy.entity.Listing;
import com.unibuddy.collegeBuddy.entity.User;
import com.unibuddy.collegeBuddy.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ListingService {

    private final ListingRepository listingRepository;
    private final FileStorageService fileStorageService;
    private final ProfanityFilterService profanityFilterService;

    @Transactional
    public ListingResponse createListing(CreateListingRequest request, User seller) {
        // Validate user is verified
        if (!seller.getEmailVerified()) {
            throw new IllegalStateException("Only verified users can create listings");
        }

        // Validate content
        profanityFilterService.validateContent(request.getTitle());
        profanityFilterService.validateContent(request.getDescription());

        // Store images
        List<String> imageUrls = fileStorageService.storeFiles(request.getImages());

        // Create listing
        Listing listing = new Listing();
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        listing.setCategory(request.getCategory());
        listing.setImages(imageUrls);
        listing.setSeller(seller);

        listing = listingRepository.save(listing);
        log.info("Created listing {} by user {}", listing.getId(), seller.getId());

        return mapToResponse(listing);
    }

    @Transactional(readOnly = true)
    public Page<ListingResponse> getListings(ListingFilters filters) {
        // Map field names from entity to database columns for native queries
        String sortField = mapSortField(filters.getSort());
        
        Sort sort = Sort.by(
            Sort.Direction.fromString(filters.getDirection()),
            sortField
        );
        
        Pageable pageable = PageRequest.of(filters.getPage(), filters.getSize(), sort);

        Page<Listing> listings = listingRepository.findWithFilters(
            filters.getCategory(),
            filters.getMinPrice(),
            filters.getMaxPrice(),
            filters.getQ(),
            pageable
        );

        return listings.map(this::mapToResponse);
    }
    
    private String mapSortField(String field) {
        return switch (field) {
            case "createdAt" -> "created_at";
            case "updatedAt" -> "updated_at";
            case "price" -> "price";
            case "title" -> "title";
            case "category" -> "category";
            default -> "created_at"; // default sort
        };
    }

    @Transactional(readOnly = true)
    public ListingResponse getListingById(UUID id) {
        Listing listing = listingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Listing not found"));
        
        return mapToResponse(listing);
    }

    private ListingResponse mapToResponse(Listing listing) {
        ListingResponse response = new ListingResponse();
        response.setId(listing.getId());
        response.setTitle(listing.getTitle());
        response.setDescription(listing.getDescription());
        response.setPrice(listing.getPrice());
        response.setCategory(listing.getCategory());
        response.setImages(listing.getImages());
        response.setStatus(listing.getStatus().name());
        response.setCreatedAt(listing.getCreatedAt());
        response.setUpdatedAt(listing.getUpdatedAt());

        // Map seller info
        ListingResponse.SellerInfo sellerInfo = new ListingResponse.SellerInfo();
        sellerInfo.setId(listing.getSeller().getId());
        sellerInfo.setName(listing.getSeller().getName());
        sellerInfo.setAvatarUrl(listing.getSeller().getAvatarUrl());
        sellerInfo.setYear(listing.getSeller().getYear());
        if (listing.getSeller().getCollege() != null) {
            sellerInfo.setCollegeName(listing.getSeller().getCollege().getName());
        }
        response.setSeller(sellerInfo);

        return response;
    }
}
