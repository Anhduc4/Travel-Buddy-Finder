package com.travelbuddy.joinrequestservice.dto;

import java.io.Serializable;

public class JoinRequestEvent implements Serializable {
    private Long requestId;
    private Long tripId;
    private Long userId;
    private String status;
    private String eventType; // join.approved or join.rejected

    public JoinRequestEvent() {}
    public JoinRequestEvent(Long requestId, Long tripId, Long userId, String status, String eventType) {
        this.requestId = requestId; this.tripId = tripId; this.userId = userId;
        this.status = status; this.eventType = eventType;
    }

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long r) { this.requestId = r; }
    public Long getTripId() { return tripId; }
    public void setTripId(Long t) { this.tripId = t; }
    public Long getUserId() { return userId; }
    public void setUserId(Long u) { this.userId = u; }
    public String getStatus() { return status; }
    public void setStatus(String s) { this.status = s; }
    public String getEventType() { return eventType; }
    public void setEventType(String e) { this.eventType = e; }
}
