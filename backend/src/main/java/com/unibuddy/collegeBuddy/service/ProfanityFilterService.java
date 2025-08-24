package com.unibuddy.collegeBuddy.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class ProfanityFilterService {

    // Basic profanity words list - in production, this should be more comprehensive
    private static final List<String> PROFANITY_WORDS = List.of(
            "fuck", "shit", "damn", "ass", "bitch", "crap", "hell"
            // Add more words as needed
    );

    private static final Pattern PROFANITY_PATTERN;

    static {
        String regex = "\\b(?:" + String.join("|", PROFANITY_WORDS) + ")\\b";
        PROFANITY_PATTERN = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
    }

    public boolean containsProfanity(String text) {
        if (text == null || text.trim().isEmpty()) {
            return false;
        }
        return PROFANITY_PATTERN.matcher(text).find();
    }

    public String filterProfanity(String text) {
        if (text == null || text.trim().isEmpty()) {
            return text;
        }
        return PROFANITY_PATTERN.matcher(text).replaceAll("***");
    }

    public void validateContent(String text) {
        if (containsProfanity(text)) {
            throw new IllegalArgumentException("Content contains inappropriate language");
        }
    }
}
