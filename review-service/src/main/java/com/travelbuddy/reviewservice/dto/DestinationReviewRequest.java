package com.travelbuddy.reviewservice.dto;

import jakarta.validation.constraints.*;

public class DestinationReviewRequest {
    @NotNull(message = "tripId is required")
    private Long tripId;

    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private int rating;

    @NotBlank(message = "Comment cannot be empty")
    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    private String comment;

    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
