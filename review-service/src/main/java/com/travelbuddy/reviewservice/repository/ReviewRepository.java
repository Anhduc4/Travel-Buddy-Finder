package com.travelbuddy.reviewservice.repository;

import com.travelbuddy.reviewservice.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByReviewedUserId(Long reviewedUserId);
    boolean existsByTripIdAndReviewerId(Long tripId, Long reviewerId);
    boolean existsByTripIdAndReviewerIdAndReviewedUserId(Long tripId, Long reviewerId, Long reviewedUserId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewedUserId = :userId")
    Double getAverageRatingByUserId(Long userId);
}
