package com.unibuddy.collegeBuddy.repository;

import com.unibuddy.collegeBuddy.entity.TutoringListing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface TutoringListingRepository extends JpaRepository<TutoringListing, UUID> {

    @Query(value = """
        SELECT * FROM tutoring_listings t 
        WHERE (:status IS NULL OR t.status = :status)
        AND (:minPrice IS NULL OR t.hourly_rate >= :minPrice)
        AND (:maxPrice IS NULL OR t.hourly_rate <= :maxPrice)
        AND (:subject IS NULL OR 
             EXISTS (
                 SELECT 1 FROM jsonb_array_elements(t.subjects) AS subj
                 WHERE subj->>'id' = :subject OR subj->>'name' ILIKE '%' || :subject || '%'
             ))
        AND (:query IS NULL OR 
             to_tsvector('english', t.title || ' ' || t.description) @@ plainto_tsquery('english', :query))
        """,
        countQuery = """
        SELECT COUNT(*) FROM tutoring_listings t 
        WHERE (:status IS NULL OR t.status = :status)
        AND (:minPrice IS NULL OR t.hourly_rate >= :minPrice)
        AND (:maxPrice IS NULL OR t.hourly_rate <= :maxPrice)
        AND (:subject IS NULL OR 
             EXISTS (
                 SELECT 1 FROM jsonb_array_elements(t.subjects) AS subj
                 WHERE subj->>'id' = :subject OR subj->>'name' ILIKE '%' || :subject || '%'
             ))
        AND (:query IS NULL OR 
             to_tsvector('english', t.title || ' ' || t.description) @@ plainto_tsquery('english', :query))
        """,
        nativeQuery = true)
    Page<TutoringListing> findWithFilters(
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("subject") String subject,
            @Param("query") String query,
            @Param("status") String status,
            Pageable pageable
    );

    // Overloaded method for backward compatibility
    default Page<TutoringListing> findWithFilters(
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String subject,
            String query,
            Pageable pageable
    ) {
        return findWithFilters(minPrice, maxPrice, subject, query, "ACTIVE", pageable);
    }

    Page<TutoringListing> findByTutorIdAndStatus(UUID tutorId, TutoringListing.Status status, Pageable pageable);

    List<TutoringListing> findByTutorId(UUID tutorId);

    int countByTutor_IdAndStatus(UUID tutorId, TutoringListing.Status status);
}

