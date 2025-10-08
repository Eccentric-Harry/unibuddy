package com.unibuddy.collegeBuddy.repository;

import com.unibuddy.collegeBuddy.entity.Listing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface ListingRepository extends JpaRepository<Listing, UUID> {
    
    @Query(value = """
        SELECT * FROM listings l 
        WHERE (:status IS NULL OR l.status = :status)
        AND (:category IS NULL OR l.category = :category)
        AND (:minPrice IS NULL OR l.price >= :minPrice)
        AND (:maxPrice IS NULL OR l.price <= :maxPrice)
        AND (:query IS NULL OR 
             to_tsvector('english', l.title || ' ' || l.description) @@ plainto_tsquery('english', :query))
        """, 
        countQuery = """
        SELECT COUNT(*) FROM listings l 
        WHERE (:status IS NULL OR l.status = :status)
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
            @Param("status") String status,
            Pageable pageable
    );
    
    // Overloaded method for backward compatibility
    default Page<Listing> findWithFilters(
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String query,
            Pageable pageable
    ) {
        return findWithFilters(category, minPrice, maxPrice, query, "ACTIVE", pageable);
    }

    Page<Listing> findBySellerIdAndStatus(UUID sellerId, Listing.Status status, Pageable pageable);
    
    // Count active listings for a seller (for rate limiting)
    int countBySeller_IdAndStatusIn(UUID sellerId, Collection<Listing.Status> statuses);
    
    // Find listings by seller ID
    List<Listing> findBySellerId(UUID sellerId);
    
    // Find listings by reserved by user ID
    List<Listing> findByReservedById(UUID reservedById);
}