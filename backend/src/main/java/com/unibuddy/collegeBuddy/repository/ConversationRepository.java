package com.unibuddy.collegeBuddy.repository;

import com.unibuddy.collegeBuddy.entity.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    
    @Query("""
        SELECT c FROM Conversation c 
        WHERE (c.buyer.id = :userId OR c.seller.id = :userId)
        ORDER BY c.updatedAt DESC
        """)
    Page<Conversation> findByUserInvolved(@Param("userId") UUID userId, Pageable pageable);

    Optional<Conversation> findByListingIdAndBuyerId(UUID listingId, UUID buyerId);

    @Query("""
        SELECT c FROM Conversation c 
        WHERE c.id = :conversationId 
        AND (c.buyer.id = :userId OR c.seller.id = :userId)
        """)
    Optional<Conversation> findByIdAndUserInvolved(@Param("conversationId") UUID conversationId, @Param("userId") UUID userId);
}
