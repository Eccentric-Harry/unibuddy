package com.unibuddy.collegeBuddy.dto.listing;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ListingFiltersDto {
    private String category;
    private String query;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Integer page = 0;
    private Integer size = 10;
    private String sort = "createdAt,desc";
}
