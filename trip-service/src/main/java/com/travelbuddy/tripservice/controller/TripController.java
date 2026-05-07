package com.travelbuddy.tripservice.controller;

import com.travelbuddy.tripservice.dto.*;
import com.travelbuddy.tripservice.service.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(@RequestBody TripRequest request, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(tripService.createTrip(request, userId));
    }

    @GetMapping
    public ResponseEntity<List<TripResponse>> getAllTrips(
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) String tags) {
        if (destination != null || tags != null) {
            return ResponseEntity.ok(tripService.searchTrips(destination, tags));
        }
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripResponse> getTripById(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TripResponse> updateTrip(@PathVariable Long id, @RequestBody TripRequest request, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(tripService.updateTrip(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        tripService.deleteTrip(id, userId);
        return ResponseEntity.noContent().build();
    }
}
