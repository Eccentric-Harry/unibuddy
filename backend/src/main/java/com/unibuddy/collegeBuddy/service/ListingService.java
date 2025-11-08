package com.unibuddy.collegeBuddy.service;

import com.unibuddy.collegeBuddy.dto.listing.*;
import com.unibuddy.collegeBuddy.entity.Conversation;
import com.unibuddy.collegeBuddy.entity.Listing;
import com.unibuddy.collegeBuddy.entity.Message;
import com.unibuddy.collegeBuddy.entity.User;
import com.unibuddy.collegeBuddy.repository.ConversationRepository;
import com.unibuddy.collegeBuddy.repository.ListingRepository;
import com.unibuddy.collegeBuddy.repository.MessageRepository;
import com.unibuddy.collegeBuddy.repository.UserRepository;
import org.hibernate.Hibernate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ListingService {

    private final ListingRepository listingRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final FileStorageService fileStorageService;
    private final ProfanityFilterService profanityFilterService;

    @Transactional
    public ListingResponse createListing(ListingCreateRequest request, User seller) {
        // Validate user is verified and ensure college is loaded
        if (!seller.getEmailVerified()) {
            throw new IllegalStateException("Only verified users can create listings");
        }

        // Force initialize the college entity
        Hibernate.initialize(seller.getCollege());
        if (seller.getCollege() == null) {
            throw new IllegalStateException("Only college users can create listings");
        }

        // Check rate limit
        int activeListingCount = listingRepository.countBySeller_IdAndStatusIn(
            seller.getId(),
            List.of(Listing.Status.ACTIVE, Listing.Status.RESERVED)
        );
        if (activeListingCount >= 10) {
            throw new IllegalStateException("You can have a maximum of 10 active listings");
        }

        // Create listing with pre-uploaded images
        Listing listing = new Listing();
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        listing.setCategory(request.getCategory());
        listing.setCondition(request.getCondition());
        listing.setYear(request.getYear());
        listing.setRegistrationNo(request.getRegistrationNo());
        listing.setImages(request.getImages().stream()
                .map(img -> new Listing.ListingImage(img.getUrl(), img.getPath(), img.getAlt()))
                .collect(Collectors.toList()));
        listing.setSeller(seller);

        listing = listingRepository.save(listing);
        log.info("Created listing {} by user {}", listing.getId(), seller.getId());

        return mapToResponse(listing);
    }

    @Transactional(readOnly = true)
    public Page<ListingResponse> getListings(ListingFiltersDto filters) {
        // Map field names from entity to database columns for native queries
        String sortField = mapSortField(filters.getSort().split(",")[0]);
        String direction = filters.getSort().split(",")[1];

        Sort sort = Sort.by(
            Sort.Direction.fromString(direction),
            sortField
        );
        
        Pageable pageable = PageRequest.of(filters.getPage(), filters.getSize(), sort);

        Page<Listing> listings = listingRepository.findWithFilters(
            filters.getCategory(),
            filters.getMinPrice(),
            filters.getMaxPrice(),
            filters.getQuery(),
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
            .orElseThrow(() -> new IllegalArgumentException("Listing not found"));

        return mapToResponse(listing);
    }

    @Transactional
    public Conversation expressInterest(UUID listingId, UUID buyerId, ExpressInterestRequest request) {
        User buyer = getUserById(buyerId);

        // Validate user is verified
        if (!buyer.getEmailVerified() || buyer.getCollege() == null) {
            throw new IllegalStateException("Only verified college users can express interest");
        }

        // Get listing
        Listing listing = listingRepository.findById(listingId)
            .orElseThrow(() -> new IllegalArgumentException("Listing not found"));

        // Check if listing is active
        if (listing.getStatus() != Listing.Status.ACTIVE) {
            throw new IllegalStateException("This listing is not available");
        }

        // Check if buyer is not the seller
        if (listing.getSeller().getId().equals(buyerId)) {
            throw new IllegalStateException("You cannot express interest in your own listing");
        }

        // Find existing conversation or create new one
        Optional<Conversation> existingConversation =
            conversationRepository.findByListingIdAndBuyerId(listingId, buyerId);

        Conversation conversation;
        boolean isNewConversation = false;

        if (existingConversation.isPresent()) {
            conversation = existingConversation.get();
        } else {
            conversation = new Conversation();
            conversation.setListing(listing);
            conversation.setBuyer(buyer);
            conversation.setSeller(listing.getSeller());
            conversation = conversationRepository.save(conversation);
            isNewConversation = true;
        }

        // Create message
        String messageText = request.getMessage();
        if (messageText == null || messageText.isBlank()) {
            messageText = "Hi, I'm interested in your listing \"" + listing.getTitle() + "\" — is it still available?";
        }

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(buyer);
        message.setMessageText(messageText);
        message = messageRepository.save(message);

        // Reserve the listing
        listing.setStatus(Listing.Status.RESERVED);
        listing.setReservedBy(buyer);
        listingRepository.save(listing);

        // Notify through WebSocket
        messagingTemplate.convertAndSend("/topic/conversations/" + conversation.getId(), message);

        return conversation;
    }

    @Transactional
    public ListingResponse updateListingStatus(UUID listingId, UUID sellerId, ListingStatusUpdateRequest request) {
        Listing listing = listingRepository.findById(listingId)
            .orElseThrow(() -> new IllegalArgumentException("Listing not found"));

        // Verify ownership
        if (!listing.getSeller().getId().equals(sellerId)) {
            throw new IllegalStateException("You can only update your own listings");
        }

        // Update status
        try {
            Listing.Status newStatus = Listing.Status.valueOf(request.getStatus().toUpperCase());

            // If changing from RESERVED to ACTIVE, clear reservedBy
            if (newStatus == Listing.Status.ACTIVE && listing.getStatus() == Listing.Status.RESERVED) {
                listing.setReservedBy(null);
            }

            listing.setStatus(newStatus);
            listing = listingRepository.save(listing);

            return mapToResponse(listing);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + request.getStatus());
        }
    }

    @Transactional
    public void reportListing(UUID listingId, UUID reporterId, String reason) {
        // Implementation for reporting a listing (placeholder)
        log.info("Listing {} reported by user {} for reason: {}", listingId, reporterId, reason);
    }

    private User getUserById(UUID userId) {
        return userRepository.findByIdWithCollege(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private ListingResponse mapToResponse(Listing listing) {
        ListingResponse response = new ListingResponse();
        response.setId(listing.getId());
        response.setTitle(listing.getTitle());
        response.setDescription(listing.getDescription());
        response.setPrice(listing.getPrice());
        response.setCategory(listing.getCategory());
        response.setCondition(listing.getCondition());
        response.setYear(listing.getYear());
        response.setRegistrationNo(listing.getRegistrationNo());
        response.setImages(listing.getImages());
        response.setStatus(listing.getStatus().name());
        response.setCreatedAt(listing.getCreatedAt());
        response.setUpdatedAt(listing.getUpdatedAt());

        // Map seller info
        ListingResponse.SellerInfo sellerInfo = new ListingResponse.SellerInfo();
        sellerInfo.setId(listing.getSeller().getId());
        sellerInfo.setName(listing.getSeller().getName());
        sellerInfo.setAvatarUrl(listing.getSeller().getAvatarUrl());
        sellerInfo.setEmail(listing.getSeller().getEmail());
        // Use listing's year/registrationNo if available, otherwise fall back to user's
        sellerInfo.setYear(listing.getYear() != null ? listing.getYear() : listing.getSeller().getYear());
        sellerInfo.setRegistrationNo(listing.getRegistrationNo() != null ? listing.getRegistrationNo() : listing.getSeller().getRegistrationNo());
        if (listing.getSeller().getCollege() != null) {
            sellerInfo.setCollegeName(listing.getSeller().getCollege().getName());
        }
        response.setSeller(sellerInfo);

        // Map reservedBy info if applicable
        if (listing.getReservedBy() != null) {
            ListingResponse.UserInfo reservedByInfo = new ListingResponse.UserInfo();
            reservedByInfo.setId(listing.getReservedBy().getId());
            reservedByInfo.setName(listing.getReservedBy().getName());
            reservedByInfo.setAvatarUrl(listing.getReservedBy().getAvatarUrl());
            response.setReservedBy(reservedByInfo);
        }

        return response;
    }
}
