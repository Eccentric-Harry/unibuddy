package com.unibuddy.collegeBuddy.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.UUID;

@Service
public class RateLimitService {

    private static final int MAX_MESSAGES_PER_WINDOW = 5;
    private static final int WINDOW_SECONDS = 10;

    private final ConcurrentHashMap<UUID, ConcurrentLinkedQueue<LocalDateTime>> userMessageTimes = new ConcurrentHashMap<>();

    public boolean isRateLimited(UUID userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = now.minusSeconds(WINDOW_SECONDS);

        ConcurrentLinkedQueue<LocalDateTime> messageTimes = userMessageTimes.computeIfAbsent(userId, id -> new ConcurrentLinkedQueue<>());

        // Remove old messages outside the window
        messageTimes.removeIf(time -> time.isBefore(windowStart));

        // Check if user has exceeded the limit
        if (messageTimes.size() >= MAX_MESSAGES_PER_WINDOW) {
            return true;
        }

        // Add current message time
        messageTimes.offer(now);
        return false;
    }

    public void recordMessage(UUID userId) {
        LocalDateTime now = LocalDateTime.now();
        ConcurrentLinkedQueue<LocalDateTime> messageTimes = userMessageTimes.computeIfAbsent(userId, id -> new ConcurrentLinkedQueue<>());
        messageTimes.offer(now);
    }
}
