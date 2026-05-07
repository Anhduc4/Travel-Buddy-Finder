package com.travelbuddy.reviewservice.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * REST client to call join-request-service for participation validation.
 * Checks if a user has an APPROVED join request for a given trip.
 */
@Component
public class JoinRequestServiceClient {

    private static final Logger log = LoggerFactory.getLogger(JoinRequestServiceClient.class);
    private final RestTemplate restTemplate;

    public JoinRequestServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Check if a user participated in a trip (has an APPROVED join request
     * OR is the trip creator).
     */
    @SuppressWarnings("unchecked")
    public boolean userParticipatedInTrip(Long tripId, Long userId) {
        try {
            String url = "http://join-request-service/api/join-requests/trip/" + tripId;
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url, HttpMethod.GET, null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {});

            List<Map<String, Object>> requests = response.getBody();
            if (requests != null) {
                return requests.stream().anyMatch(req ->
                        userId.equals(((Number) req.get("userId")).longValue())
                        && "APPROVED".equals(req.get("status")));
            }
            return false;
        } catch (Exception e) {
            log.error("Failed to check participation for user {} in trip {}: {}",
                    userId, tripId, e.getMessage());
            return false;
        }
    }
}
