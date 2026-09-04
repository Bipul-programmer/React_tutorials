package com.devhub.queue.listener;

import com.devhub.queue.event.CourseEnrolledEvent;
import com.devhub.queue.event.LessonCompletedEvent;
import com.devhub.queue.event.NotificationEvent;
import com.devhub.queue.model.FailedEvent;
import com.devhub.queue.publisher.EventPublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class CourseEventListener {

    private static final Logger log = LoggerFactory.getLogger(CourseEventListener.class);

    private final EventPublisher eventPublisher;

    public CourseEventListener(EventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    @Async("eventTaskExecutor")
    @EventListener
    public void onCourseEnrolled(CourseEnrolledEvent event) {
        try {
            log.info("Processing COURSE_ENROLLED event: userId={}, courseId={}, courseName={}",
                    event.getUserId(), event.getCourseId(), event.getCourseName());

            // Initialize progress record
            initializeProgressRecord(event);

            // Publish enrollment confirmation notification (IN_APP + EMAIL)
            String enrollMessage = "You have successfully enrolled in \"" + event.getCourseName() + "\". "
                    + "Start learning now!";

            eventPublisher.publish(new NotificationEvent(
                    event.getUserId(),
                    "Course Enrollment",
                    enrollMessage,
                    "IN_APP"));

            eventPublisher.publish(new NotificationEvent(
                    event.getUserId(),
                    "Course Enrollment",
                    enrollMessage,
                    "EMAIL"));

        } catch (Exception ex) {
            FailedEvent failed = new FailedEvent(
                    event.getEventId(),
                    event.getEvenType().name(),
                    ex.getMessage());
            log.error("Failed to handle CourseEnrolledEvent: {}", failed);
        }
    }

    @Async("eventTaskExecutor")
    @EventListener
    public void onLessonCompleted(LessonCompletedEvent event) {
        try {
            log.info("Processing LESSON_COMPLETED event: userId={}, lessonId={}, courseId={}",
                    event.getUserId(), event.getLessonId(), event.getCourseId());

            // Recalculate course progress
            recalculateProgress(event);

            // Publish in-app notification about lesson completion
            String progressMessage = "Great job! You completed \"" + event.getLessonTitle() + "\". "
                    + "Keep up the momentum!";

            eventPublisher.publish(new NotificationEvent(
                    event.getUserId(),
                    "Lesson Completed",
                    progressMessage,
                    "IN_APP"));

        } catch (Exception ex) {
            FailedEvent failed = new FailedEvent(
                    event.getEventId(),
                    event.getEvenType().name(),
                    ex.getMessage());
            log.error("Failed to handle LessonCompletedEvent: {}", failed);
        }
    }

    private void initializeProgressRecord(CourseEnrolledEvent event) {
        log.debug("Initializing progress record for user {} in course {}",
                event.getUserId(), event.getCourseId());
        // TODO: persist enrollment/progress record to DB
    }

    private void recalculateProgress(LessonCompletedEvent event) {
        log.debug("Recalculating progress for user {} in course {}",
                event.getUserId(), event.getCourseId());
        // TODO: update progress percentage in DB, check if course is 100% complete
    }
}
