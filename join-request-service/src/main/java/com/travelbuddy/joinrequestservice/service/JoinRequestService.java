package com.travelbuddy.joinrequestservice.service;

import com.travelbuddy.joinrequestservice.client.TripServiceClient;
import com.travelbuddy.joinrequestservice.config.RabbitMQConfig;
import com.travelbuddy.joinrequestservice.dto.JoinRequestEvent;
import com.travelbuddy.joinrequestservice.entity.JoinRequest;
import com.travelbuddy.joinrequestservice.exception.ForbiddenException;
import com.travelbuddy.joinrequestservice.exception.ResourceNotFoundException;
import com.travelbuddy.joinrequestservice.repository.JoinRequestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JoinRequestService {

    private static final Logger log = LoggerFactory.getLogger(JoinRequestService.class);

    private final JoinRequestRepository repository;
    private final RabbitTemplate rabbitTemplate;
    private final TripServiceClient tripServiceClient;

    public JoinRequestService(JoinRequestRepository repository,
                              RabbitTemplate rabbitTemplate,
                              TripServiceClient tripServiceClient) {
        this.repository = repository;
        this.rabbitTemplate = rabbitTemplate;
        this.tripServiceClient = tripServiceClient;
    }

    public JoinRequest createRequest(Long tripId, Long userId) {
        JoinRequest existingRequest = repository.findByTripIdAndUserId(tripId, userId).orElse(null);
        if (existingRequest != null && ("REJECTED".equals(existingRequest.getStatus()) || "REMOVED".equals(existingRequest.getStatus()))) {
            existingRequest.setStatus("PENDING");
            return repository.save(existingRequest);
        }
        if (existingRequest != null) {
            throw new IllegalStateException("You already sent a join request for this trip");
        }
        JoinRequest request = new JoinRequest();
        request.setTripId(tripId);
        request.setUserId(userId);
        request.setStatus("PENDING");
        return repository.save(request);
    }

    /**
     * SECURITY FIX: Verify that authenticatedUserId is the trip creator before approving.
     */
    public JoinRequest approveRequest(Long id, Long authenticatedUserId) {
        JoinRequest request = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Join request not found"));

        // --- AUTHORIZATION CHECK ---
        verifyTripOwnership(request.getTripId(), authenticatedUserId);

        if (!"PENDING".equals(request.getStatus())) {
            throw new IllegalStateException("Request already processed");
        }
        request.setStatus("APPROVED");
        request = repository.save(request);

        // Publish event to RabbitMQ
        JoinRequestEvent event = new JoinRequestEvent(
                request.getId(), request.getTripId(), request.getUserId(), "APPROVED", "join.approved");
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, "join.request.approved", event);
        log.info("✅ Join request {} approved by trip owner {}", id, authenticatedUserId);

        return request;
    }

    /**
     * SECURITY FIX: Same ownership check for reject.
     */
    public JoinRequest rejectRequest(Long id, Long authenticatedUserId) {
        JoinRequest request = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Join request not found"));

        // --- AUTHORIZATION CHECK ---
        verifyTripOwnership(request.getTripId(), authenticatedUserId);

        if (!"PENDING".equals(request.getStatus())) {
            throw new IllegalStateException("Request already processed");
        }
        request.setStatus("REJECTED");
        request = repository.save(request);

        JoinRequestEvent event = new JoinRequestEvent(
                request.getId(), request.getTripId(), request.getUserId(), "REJECTED", "join.rejected");
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, "join.request.rejected", event);
        log.info("❌ Join request {} rejected by trip owner {}", id, authenticatedUserId);

        return request;
    }

    public JoinRequest removeParticipant(Long id, Long authenticatedUserId) {
        JoinRequest request = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Join request not found"));

        verifyTripOwnership(request.getTripId(), authenticatedUserId);

        if (!"APPROVED".equals(request.getStatus())) {
            throw new IllegalStateException("Only approved participants can be removed");
        }
        request.setStatus("REMOVED");
        return repository.save(request);
    }

    public boolean isApprovedParticipant(Long tripId, Long userId) {
        return repository.findByTripIdAndUserIdAndStatus(tripId, userId, "APPROVED").isPresent();
    }

    /**
     * Calls trip-service to verify the authenticated user is the trip creator.
     * Throws ForbiddenException if not.
     */
    private void verifyTripOwnership(Long tripId, Long authenticatedUserId) {
        Long creatorId = tripServiceClient.getCreatorId(tripId);
        if (creatorId == null) {
            throw new ResourceNotFoundException("Trip not found: " + tripId);
        }
        if (!creatorId.equals(authenticatedUserId)) {
            log.warn("🚫 User {} attempted to manage join requests for trip {} owned by {}",
                    authenticatedUserId, tripId, creatorId);
            throw new ForbiddenException("Only the trip creator can approve/reject join requests");
        }
    }

    public List<JoinRequest> getByTripId(Long tripId) { return repository.findByTripId(tripId); }
    public List<JoinRequest> getByUserId(Long userId) { return repository.findByUserId(userId); }
}
