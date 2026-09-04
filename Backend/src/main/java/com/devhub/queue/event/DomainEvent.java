package com.devhub.queue.event;

import java.time.LocalDateTime;
import java.util.UUID;

public abstract class DomainEvent {
    private final String eventId;
    private final EventType eventType;
    private final LocalDateTime occurredAt;

    protected DomainEvent(EventType eventType) {
        this.eventId = UUID.randomUUID().toString();
        this.eventType = eventType;
        this.occurredAt = LocalDateTime.now();
    }

    public String getEventId() {
        return eventId;
    }

    public EventType getEventType() {
        return eventType;
    }

    public EventType getEvenType() {
        return eventType;
    }

    public LocalDateTime getOccurredAt() {
        return occurredAt;
    }
}
