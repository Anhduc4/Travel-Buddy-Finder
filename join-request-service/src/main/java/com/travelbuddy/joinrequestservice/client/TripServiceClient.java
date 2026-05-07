package com.travelbuddy.joinrequestservice.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * REST client to call trip-service via Eureka service discovery.
 * Used to verify trip ownership for authorization checks.
 */
@Component
public class TripServiceClient {

    private static final Logger log = LoggerFactory.getLogger(TripServiceClient.class);
    private final RestTemplate restTemplate;

    public TripServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Get the creatorId of a trip by calling trip-service.
     * @return creatorId or null if trip not found
     */
    @SuppressWarnings("unchecked")
    public Long getCreatorId(Long tripId) {
        try {
            String url = "http://trip-service/api/trips/" + tripId;
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("creatorId")) {
                return ((Number) response.get("creatorId")).longValue();
            }
            return null;
        } catch (Exception e) {
            log.error("Failed to fetch trip {} from trip-service: {}", tripId, e.getMessage());
            return null;
        }
    }
}
