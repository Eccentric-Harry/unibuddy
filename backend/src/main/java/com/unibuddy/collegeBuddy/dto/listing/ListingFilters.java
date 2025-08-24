package com.unibuddy.collegeBuddy.dto.listing;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ListingFilters {
    private String category;
    private String q; // search query
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private int page = 0;
    private int size = 20;
    private String sort = "createdAt";
    private String direction = "DESC";
}
