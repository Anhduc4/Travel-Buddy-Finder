package com.travelbuddy.tripservice.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TripResponse {
    private Long id;
    private Long creatorId;
    private String destination;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private int maxPeople;
    private String tags;
    private String imageUrl;
    private boolean completed;
    private LocalDateTime createdAt;

    public TripResponse() {}

    public TripResponse(Long id, Long creatorId, String destination, String description,
                        LocalDate startDate, LocalDate endDate, int maxPeople, String tags, LocalDateTime createdAt) {
        this(id, creatorId, destination, description, startDate, endDate, maxPeople, tags, null, false, createdAt);
    }

    public TripResponse(Long id, Long creatorId, String destination, String description,
                        LocalDate startDate, LocalDate endDate, int maxPeople, String tags,
                        String imageUrl, boolean completed, LocalDateTime createdAt) {
        this.id = id; this.creatorId = creatorId; this.destination = destination;
        this.description = description; this.startDate = startDate; this.endDate = endDate;
        this.maxPeople = maxPeople; this.tags = tags; this.imageUrl = imageUrl;
        this.completed = completed; this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getCreatorId() { return creatorId; }
    public String getDestination() { return destination; }
    public String getDescription() { return description; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public int getMaxPeople() { return maxPeople; }
    public String getTags() { return tags; }
    public String getImageUrl() { return imageUrl; }
    public boolean isCompleted() { return completed; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
