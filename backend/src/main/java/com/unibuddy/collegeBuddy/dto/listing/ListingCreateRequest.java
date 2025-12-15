package com.unibuddy.collegeBuddy.dto.listing;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListingCreateRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 255, message = "Title must be between 5 and 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 20, message = "Description must be at least 20 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotBlank(message = "Category is required")
    private String category;

    private String condition;

    private Short year;

    @Size(max = 100, message = "Registration number must not exceed 100 characters")
    private String registrationNo;

    @Size(max = 5, message = "Maximum 5 images allowed")
    private List<ListingImageDto> images;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ListingImageDto {
        private String url;
        private String path;
        private String alt;
    }
}
