package com.devhub.queue.model;

import java.time.LocalDateTime;

public class FailedEvent {
    private final String eventId;
    private final String eventType;
    private final String errorMessage;
    private final LocalDateTime failedAt;

    public FailedEvent(String eventId, String eventType, String errorMessage) {
        this.eventId = eventId;
        this.eventType = eventType;
        this.errorMessage = errorMessage;
        this.failedAt = LocalDateTime.now();
    }

    public String getEventId() {
        return eventId;
    }

    public String getEventType() {
        return eventType;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public LocalDateTime getFailedAt() {
        return failedAt;
    }

    public String toString() {
        return "FailedEvent{eventId='" + eventId + "' , eventType='" + eventType + "' , errorMessage='" + errorMessage
                + "' , failedAt='" + failedAt + "}";
    }
}
