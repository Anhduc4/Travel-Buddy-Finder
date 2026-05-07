package com.travelbuddy.reviewservice.service;

import com.travelbuddy.reviewservice.client.JoinRequestServiceClient;
import com.travelbuddy.reviewservice.client.TripServiceClient;
import com.travelbuddy.reviewservice.dto.DestinationReviewRequest;
import com.travelbuddy.reviewservice.dto.ReviewRequest;
import com.travelbuddy.reviewservice.entity.DestinationReview;
import com.travelbuddy.reviewservice.entity.Review;
import com.travelbuddy.reviewservice.repository.DestinationReviewRepository;
import com.travelbuddy.reviewservice.repository.ReviewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {

    private static final Logger log = LoggerFactory.getLogger(ReviewService.class);

    private final ReviewRepository repository;
    private final DestinationReviewRepository destinationReviewRepository;
    private final TripServiceClient tripServiceClient;
    private final JoinRequestServiceClient joinRequestServiceClient;

    public ReviewService(ReviewRepository repository,
                         DestinationReviewRepository destinationReviewRepository,
                         TripServiceClient tripServiceClient,
                         JoinRequestServiceClient joinRequestServiceClient) {
        this.repository = repository;
        this.destinationReviewRepository = destinationReviewRepository;
        this.tripServiceClient = tripServiceClient;
        this.joinRequestServiceClient = joinRequestServiceClient;
    }

    public Review createReview(ReviewRequest request, Long reviewerId) {
        // ---- BUSINESS VALIDATION ----

        // 1. Cannot review yourself
        if (reviewerId.equals(request.getReviewedUserId())) {
            throw new IllegalStateException("Cannot review yourself");
        }

        // 2. One review per user per trip
        if (repository.existsByTripIdAndReviewerIdAndReviewedUserId(
                request.getTripId(), reviewerId, request.getReviewedUserId())) {
            throw new IllegalStateException("You already reviewed this user for this trip");
        }

        // 3. Validate trip exists
        if (!tripServiceClient.tripExists(request.getTripId())) {
            throw new IllegalStateException("Trip not found: " + request.getTripId());
        }

        // 4. Validate trip is completed (endDate in the past)
        if (!tripServiceClient.isTripCompleted(request.getTripId())) {
            log.warn("⚠️ User {} attempted to review before trip {} ended", reviewerId, request.getTripId());
            throw new IllegalStateException("Cannot review before the trip has ended");
        }

        // 5. Validate reviewer participated in the trip
        // (either as creator or with an APPROVED join request)
        Long creatorId = tripServiceClient.getCreatorId(request.getTripId());
        boolean reviewerIsCreator = reviewerId.equals(creatorId);
        if (!reviewerIsCreator && !joinRequestServiceClient.userParticipatedInTrip(
                request.getTripId(), reviewerId)) {
            log.warn("🚫 User {} tried to review trip {} without participating", reviewerId, request.getTripId());
            throw new IllegalStateException("You must have participated in the trip to leave a review");
        }

        // 6. Validate reviewed user participated in the trip
        boolean reviewedIsCreator = request.getReviewedUserId().equals(creatorId);
        if (!reviewedIsCreator && !joinRequestServiceClient.userParticipatedInTrip(
                request.getTripId(), request.getReviewedUserId())) {
            throw new IllegalStateException("The reviewed user did not participate in this trip");
        }

        // ---- CREATE REVIEW ----
        Review review = new Review();
        review.setTripId(request.getTripId());
        review.setReviewerId(reviewerId);
        review.setReviewedUserId(request.getReviewedUserId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        log.info("✅ Review created: user {} reviewed user {} for trip {}",
                reviewerId, request.getReviewedUserId(), request.getTripId());

        return repository.save(review);
    }

    public List<Review> getReviewsByUserId(Long userId) {
        return repository.findByReviewedUserId(userId);
    }

    public Double getAverageRating(Long userId) {
        Double avg = repository.getAverageRatingByUserId(userId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    public DestinationReview createDestinationReview(DestinationReviewRequest request, Long reviewerId) {
        if (!tripServiceClient.tripExists(request.getTripId())) {
            throw new IllegalStateException("Trip not found: " + request.getTripId());
        }
        if (!tripServiceClient.isTripCompleted(request.getTripId())) {
            throw new IllegalStateException("Cannot review destination before the trip has ended");
        }
        Long creatorId = tripServiceClient.getCreatorId(request.getTripId());
        boolean reviewerIsCreator = reviewerId.equals(creatorId);
        if (!reviewerIsCreator && !joinRequestServiceClient.userParticipatedInTrip(request.getTripId(), reviewerId)) {
            throw new IllegalStateException("You must have participated in the trip to review this destination");
        }
        if (destinationReviewRepository.existsByTripIdAndReviewerId(request.getTripId(), reviewerId)) {
            throw new IllegalStateException("You already reviewed this destination for this trip");
        }

        String destination = tripServiceClient.getDestination(request.getTripId());
        DestinationReview review = new DestinationReview();
        review.setTripId(request.getTripId());
        review.setDestination(destination);
        review.setReviewerId(reviewerId);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        return destinationReviewRepository.save(review);
    }

    public List<DestinationReview> getDestinationReviews(String destination) {
        return destinationReviewRepository.findByDestination(destination);
    }
}
