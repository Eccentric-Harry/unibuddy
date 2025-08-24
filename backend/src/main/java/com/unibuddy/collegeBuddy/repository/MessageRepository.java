package com.unibuddy.collegeBuddy.repository;

import com.unibuddy.collegeBuddy.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    
    Page<Message> findByConversationIdOrderByCreatedAtAsc(UUID conversationId, Pageable pageable);

    @Query("""
        SELECT m FROM Message m 
        WHERE m.conversation.id = :conversationId 
        ORDER BY m.createdAt DESC 
        LIMIT 1
        """)
    Optional<Message> findLatestByConversationId(@Param("conversationId") UUID conversationId);

    long countBySenderIdAndCreatedAtAfter(UUID senderId, java.time.LocalDateTime since);
}
