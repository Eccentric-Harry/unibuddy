package com.unibuddy.collegeBuddy.dto.listing;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListingStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private String status;
}
