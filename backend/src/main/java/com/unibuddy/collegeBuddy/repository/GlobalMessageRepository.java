package com.unibuddy.collegeBuddy.repository;

import com.unibuddy.collegeBuddy.entity.GlobalMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GlobalMessageRepository extends JpaRepository<GlobalMessage, UUID> {
    
    Page<GlobalMessage> findByGlobalChatIdOrderByCreatedAtAsc(UUID globalChatId, Pageable pageable);

    @Query("""
        SELECT m FROM GlobalMessage m 
        WHERE m.globalChat.id = :globalChatId 
        ORDER BY m.createdAt DESC 
        LIMIT 1
        """)
    Optional<GlobalMessage> findLatestByGlobalChatId(@Param("globalChatId") UUID globalChatId);

    long countBySenderIdAndCreatedAtAfter(UUID senderId, java.time.LocalDateTime since);
}
