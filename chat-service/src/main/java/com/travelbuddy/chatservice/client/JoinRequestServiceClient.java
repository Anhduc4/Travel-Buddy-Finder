package com.travelbuddy.chatservice.client;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
public class JoinRequestServiceClient {
    private final RestTemplate restTemplate;

    public JoinRequestServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean isApprovedParticipant(Long tripId, Long userId) {
        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                "http://join-request-service/api/join-requests/trip/" + tripId,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {});
        List<Map<String, Object>> requests = response.getBody();
        return requests != null && requests.stream().anyMatch(req ->
                userId.equals(((Number) req.get("userId")).longValue())
                        && "APPROVED".equals(req.get("status")));
    }
}
