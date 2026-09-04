package com.devhub.queue.listener;

import com.devhub.queue.event.NotificationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class NotificationEventListener {

    private static final Logger log = LoggerFactory.getLogger(NotificationEventListener.class);

    @Async
    @EventListener
    public void onNotification(NotificationEvent event) {
        log.info("Processing NOTIFICATION event: recipientId={}, type={}, title={}",
                event.getRecipientId(), event.getType(), event.getTitle());

        switch (event.getType()) {
            case "EMAIL" -> handleEmailNotification(event);
            case "IN_APP" -> handleInAppNotification(event);
            case "PUSH" -> handlePushNotification(event);
            default -> log.warn("Unknown notification type: {}", event.getType());
        }
    }

    private void handleEmailNotification(NotificationEvent event) {
        log.info("Sending EMAIL to recipientId={}: {}", event.getRecipientId(), event.getTitle());
        // TODO: Integrate JavaMailSender
    }

    private void handleInAppNotification(NotificationEvent event) {
        log.info("Saving IN_APP notification for recipientId={}", event.getRecipientId());
        // TODO: Save to notifications table via NotificationService
    }

    private void handlePushNotification(NotificationEvent event) {
        log.info("Sending PUSH notification to recipientId={}", event.getRecipientId());
        // TODO: Integrate Firebase / APNs
    }
}
