package com.devhub.queue.listener;

import com.devhub.queue.event.NotificationEvent;
import com.devhub.queue.event.UserRegisteredEvent;
import com.devhub.queue.model.FailedEvent;
import com.devhub.queue.publisher.EventPublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class UserEventListener {

    private static final Logger log = LoggerFactory.getLogger(UserEventListener.class);

    private final EventPublisher eventPublisher;

    public UserEventListener(EventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    @Async("eventTaskExecutor")
    @EventListener
    public void onUserRegistered(UserRegisteredEvent event) {
        try {
            log.info("Processing USER_REGISTERED event for userId={}, email={}",
                    event.getUserId(), event.getUserEmail());

            // Publish a welcome notification via EMAIL channel
            String welcomeMessage = "Welcome to DevHub, " + event.getUserName() + "! "
                    + "Your account has been created successfully.";

            eventPublisher.publish(new NotificationEvent(
                    event.getUserId(),
                    "Welcome to DevHub!",
                    welcomeMessage,
                    "EMAIL"
            ));

        } catch (Exception ex) {
            FailedEvent failed = new FailedEvent(
                    event.getEventId(),
                    event.getEventType().name(),
                    ex.getMessage());
            log.error("Failed to handle UserRegisteredEvent: {}", failed);
        }
    }
}
