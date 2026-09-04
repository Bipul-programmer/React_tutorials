package com.devhub.queue.event;

public class CourseEnrolledEvent extends DomainEvent {

    private final Long userId;
    private final Long courseId;
    private final String courseName;

    public CourseEnrolledEvent(Long userId, Long courseId, String courseName) {
        super(EventType.COURSE_ENROLLED);
        this.userId = userId;
        this.courseId = courseId;
        this.courseName = courseName;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getCourseName() {
        return courseName;
    }
}
