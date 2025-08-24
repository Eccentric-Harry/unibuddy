package com.unibuddy.collegeBuddy.repository;

import com.unibuddy.collegeBuddy.entity.Listing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.UUID;

@Repository
public interface ListingRepository extends JpaRepository<Listing, UUID> {
    
    @Query(value = """
        SELECT * FROM listings l 
        WHERE l.status = 'ACTIVE'
        AND (:category IS NULL OR l.category = :category)
        AND (:minPrice IS NULL OR l.price >= :minPrice)
        AND (:maxPrice IS NULL OR l.price <= :maxPrice)
        AND (:query IS NULL OR 
             to_tsvector('english', l.title || ' ' || l.description) @@ plainto_tsquery('english', :query))
        """, 
        countQuery = """
        SELECT COUNT(*) FROM listings l 
        WHERE l.status = 'ACTIVE'
        AND (:category IS NULL OR l.category = :category)
        AND (:minPrice IS NULL OR l.price >= :minPrice)
        AND (:maxPrice IS NULL OR l.price <= :maxPrice)
        AND (:query IS NULL OR 
             to_tsvector('english', l.title || ' ' || l.description) @@ plainto_tsquery('english', :query))
        """,
        nativeQuery = true)
    Page<Listing> findWithFilters(
            @Param("category") String category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("query") String query,
            Pageable pageable
    );

    Page<Listing> findBySellerIdAndStatus(UUID sellerId, Listing.Status status, Pageable pageable);
}
