package com.travelbuddy.reviewservice.dto;

import jakarta.validation.constraints.*;

public class ReviewRequest {
    @NotNull(message = "tripId is required")
    private Long tripId;

    @NotNull(message = "reviewedUserId is required")
    private Long reviewedUserId;

    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private int rating;

    @NotBlank(message = "Comment cannot be empty")
    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    private String comment;

    public Long getTripId() { return tripId; }
    public void setTripId(Long t) { this.tripId = t; }
    public Long getReviewedUserId() { return reviewedUserId; }
    public void setReviewedUserId(Long r) { this.reviewedUserId = r; }
    public int getRating() { return rating; }
    public void setRating(int r) { this.rating = r; }
    public String getComment() { return comment; }
    public void setComment(String c) { this.comment = c; }
}
