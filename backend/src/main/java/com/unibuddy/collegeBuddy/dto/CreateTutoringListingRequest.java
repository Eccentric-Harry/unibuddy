package com.unibuddy.collegeBuddy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTutoringListingRequest {

    private String title;
    private String description;
    private BigDecimal hourlyRate;
    private List<String> subjects; // Just subject names from the frontend
    private List<String> syllabus;
    private List<String> availability;
}

