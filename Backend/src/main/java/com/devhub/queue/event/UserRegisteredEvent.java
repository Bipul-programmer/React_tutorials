package com.devhub.queue.event;

public class UserRegisteredEvent extends DomainEvent {

    private final Long userId;
    private final String email;
    private final String name;

    public UserRegisteredEvent(Long userId, String email, String name) {
        super(EventType.USER_REGISTERED);
        this.userId = userId;
        this.email = email;
        this.name = name;
    }

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getUserEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getUserName() {
        return name;
    }
}
