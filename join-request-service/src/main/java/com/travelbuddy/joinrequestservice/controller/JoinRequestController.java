package com.travelbuddy.joinrequestservice.controller;

import com.travelbuddy.joinrequestservice.dto.JoinRequestDTO;
import com.travelbuddy.joinrequestservice.entity.JoinRequest;
import com.travelbuddy.joinrequestservice.service.JoinRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/join-requests")
public class JoinRequestController {

    private final JoinRequestService service;
    public JoinRequestController(JoinRequestService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<JoinRequest> create(@RequestBody JoinRequestDTO dto, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(service.createRequest(dto.getTripId(), userId));
    }

    /**
     * SECURITY FIX: Extract authenticated user from JWT and pass to service
     * for trip ownership verification. Only the trip creator can approve.
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<JoinRequest> approve(@PathVariable Long id, Authentication auth) {
        Long authenticatedUserId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(service.approveRequest(id, authenticatedUserId));
    }

    /**
     * SECURITY FIX: Same ownership check for reject.
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<JoinRequest> reject(@PathVariable Long id, Authentication auth) {
        Long authenticatedUserId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(service.rejectRequest(id, authenticatedUserId));
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<JoinRequest>> getByTrip(@PathVariable Long tripId) {
        return ResponseEntity.ok(service.getByTripId(tripId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<JoinRequest>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getByUserId(userId));
    }
}
