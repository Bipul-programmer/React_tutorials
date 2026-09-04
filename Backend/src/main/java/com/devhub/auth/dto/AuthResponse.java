package com.devhub.auth.dto;

import com.devhub.user.entity.User;

public record AuthResponse(
        String token,
        Long userId,
        String name,
        String email,
        User.Role role
) {}
