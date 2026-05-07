package com.travelbuddy.chatservice.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class TripServiceClient {
    private final RestTemplate restTemplate;

    public TripServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @SuppressWarnings("unchecked")
    public Long getCreatorId(Long tripId) {
        Map<String, Object> trip = restTemplate.getForObject("http://trip-service/api/trips/" + tripId, Map.class);
        if (trip == null || trip.get("creatorId") == null) return null;
        return ((Number) trip.get("creatorId")).longValue();
    }
}
