package com.devhub.user.dto;

import com.devhub.user.entity.User;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        User.Role role,
        LocalDateTime createdAt
) {}
