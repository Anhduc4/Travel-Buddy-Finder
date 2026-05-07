package com.travelbuddy.reviewservice.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.Map;

/**
 * REST client to call trip-service for validation.
 * Validates trip existence and completion status.
 */
@Component
public class TripServiceClient {

    private static final Logger log = LoggerFactory.getLogger(TripServiceClient.class);
    private final RestTemplate restTemplate;

    public TripServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Fetch trip details. Returns null if trip not found.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getTripById(Long tripId) {
        try {
            return restTemplate.getForObject("http://trip-service/api/trips/" + tripId, Map.class);
        } catch (Exception e) {
            log.error("Failed to fetch trip {}: {}", tripId, e.getMessage());
            return null;
        }
    }

    /**
     * Check if a trip exists.
     */
    public boolean tripExists(Long tripId) {
        return getTripById(tripId) != null;
    }

    /**
     * Check if a trip is completed (endDate is in the past).
     */
    public boolean isTripCompleted(Long tripId) {
        Map<String, Object> trip = getTripById(tripId);
        if (trip == null || trip.get("endDate") == null) return false;
        try {
            LocalDate endDate = LocalDate.parse(trip.get("endDate").toString());
            return endDate.isBefore(LocalDate.now());
        } catch (Exception e) {
            log.warn("Could not parse endDate for trip {}", tripId);
            return false;
        }
    }

    /**
     * Get the creatorId of a trip.
     */
    public Long getCreatorId(Long tripId) {
        Map<String, Object> trip = getTripById(tripId);
        if (trip != null && trip.containsKey("creatorId")) {
            return ((Number) trip.get("creatorId")).longValue();
        }
        return null;
    }
}
