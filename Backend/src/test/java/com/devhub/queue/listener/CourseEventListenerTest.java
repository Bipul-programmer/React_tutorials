package com.devhub.queue.listener;

import com.devhub.queue.event.CourseEnrolledEvent;
import com.devhub.queue.event.LessonCompletedEvent;
import com.devhub.queue.event.NotificationEvent;
import com.devhub.queue.publisher.EventPublisher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseEventListenerTest {

    @Mock
    private EventPublisher eventPublisher;

    @InjectMocks
    private CourseEventListener courseEventListener;

    @BeforeEach
    void setUp() {
    }

    @Test
    void onCourseEnrolled_PublishesNotificationEvents() {
        CourseEnrolledEvent event = new CourseEnrolledEvent(1L, 100L, "Full Stack Spring Boot");

        courseEventListener.onCourseEnrolled(event);

        ArgumentCaptor<NotificationEvent> captor = ArgumentCaptor.forClass(NotificationEvent.class);
        verify(eventPublisher, times(2)).publish(captor.capture());

        List<NotificationEvent> publishedEvents = captor.getAllValues();
        assertEquals(2, publishedEvents.size());
        assertEquals("IN_APP", publishedEvents.get(0).getType());
        assertEquals("EMAIL", publishedEvents.get(1).getType());
    }

    @Test
    void onLessonCompleted_PublishesNotificationEvent() {
        LessonCompletedEvent event = new LessonCompletedEvent(1L, 10L, 100L, "Building REST APIs");

        courseEventListener.onLessonCompleted(event);

        ArgumentCaptor<NotificationEvent> captor = ArgumentCaptor.forClass(NotificationEvent.class);
        verify(eventPublisher, times(1)).publish(captor.capture());

        NotificationEvent published = captor.getValue();
        assertEquals("IN_APP", published.getType());
        assertEquals("Lesson Completed", published.getTitle());
    }
}
