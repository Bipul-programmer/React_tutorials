package com.devhub.queue.event;

public class NotificationEvent extends DomainEvent {
    private final long recipientId;
    private final String title;
    private final String message;
    private final String type;

    public NotificationEvent(long recipientId, String title, String message, String type) {
        super(EventType.NOTIFICATION_SEND);
        this.recipientId = recipientId;
        this.title = title;
        this.message = message;
        this.type = type;
    }

    public long getRecipientId() {
        return recipientId;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public String getType() {
        return type;
    }
}
