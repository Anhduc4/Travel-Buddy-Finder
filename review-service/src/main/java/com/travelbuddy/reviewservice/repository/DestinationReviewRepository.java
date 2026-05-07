package com.travelbuddy.reviewservice.repository;

import com.travelbuddy.reviewservice.entity.DestinationReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface DestinationReviewRepository extends JpaRepository<DestinationReview, Long> {
    @Query("SELECT r FROM DestinationReview r WHERE LOWER(r.destination) = LOWER(:destination) ORDER BY r.createdAt DESC")
    List<DestinationReview> findByDestination(String destination);

    boolean existsByTripIdAndReviewerId(Long tripId, Long reviewerId);
}
