package com.devhub.queue.event;

public class LessonCompletedEvent extends DomainEvent {
    private final Long userId;
    private final Long lessonId;
    private final Long courseId;
    private final String lessonTitle;

    public LessonCompletedEvent(Long userId, Long lessonId, Long courseId, String lessonTitle) {
        super(EventType.LESSON_COMPLETED);
        this.userId = userId;
        this.lessonId = lessonId;
        this.courseId = courseId;
        this.lessonTitle = lessonTitle;
    }

    public LessonCompletedEvent(Long userId, Long lessonId, Long courseId) {
        this(userId, lessonId, courseId, "Lesson " + lessonId);
    }

    public Long getUserId() {
        return userId;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getLessonTitle() {
        return lessonTitle;
    }
}
