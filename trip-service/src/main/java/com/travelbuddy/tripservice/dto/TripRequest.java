package com.travelbuddy.tripservice.dto;

import java.time.LocalDate;

public class TripRequest {
    private String destination;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private int maxPeople;
    private String tags;
    private String imageUrl;

    public String getDestination() { return destination; }
    public void setDestination(String d) { this.destination = d; }
    public String getDescription() { return description; }
    public void setDescription(String d) { this.description = d; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate s) { this.startDate = s; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate e) { this.endDate = e; }
    public int getMaxPeople() { return maxPeople; }
    public void setMaxPeople(int m) { this.maxPeople = m; }
    public String getTags() { return tags; }
    public void setTags(String t) { this.tags = t; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
