package com.travelbuddy.reviewservice.controller;

import com.travelbuddy.reviewservice.dto.DestinationReviewRequest;
import com.travelbuddy.reviewservice.dto.ReviewRequest;
import com.travelbuddy.reviewservice.entity.DestinationReview;
import com.travelbuddy.reviewservice.entity.Review;
import com.travelbuddy.reviewservice.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService service;
    public ReviewController(ReviewService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<Review> create(@Valid @RequestBody ReviewRequest request, Authentication auth) {
        Long reviewerId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(service.createReview(request, reviewerId));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Review>> getByUser(@PathVariable Long id) {
        return ResponseEntity.ok(service.getReviewsByUserId(id));
    }

    @GetMapping("/user/{id}/average")
    public ResponseEntity<Map<String, Double>> getAverage(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("averageRating", service.getAverageRating(id)));
    }

    @PostMapping("/destinations")
    public ResponseEntity<DestinationReview> createDestinationReview(@Valid @RequestBody DestinationReviewRequest request,
                                                                    Authentication auth) {
        Long reviewerId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(service.createDestinationReview(request, reviewerId));
    }

    @GetMapping("/destinations/{destination}")
    public ResponseEntity<List<DestinationReview>> getDestinationReviews(@PathVariable String destination) {
        return ResponseEntity.ok(service.getDestinationReviews(destination));
    }
}
