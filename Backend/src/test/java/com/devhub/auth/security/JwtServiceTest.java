package com.devhub.auth.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private final String secretKey = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final long expiration = 3600000; // 1 hour

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);
        ReflectionTestUtils.setField(jwtService, "expiration", expiration);
    }

    @Test
    void generateToken_And_ExtractUsername() {
        UserDetails userDetails = new User("developer@devhub.com", "password", Collections.emptyList());

        String token = jwtService.generateToken(userDetails);
        assertNotNull(token);
        assertFalse(token.isBlank());

        String extractedUsername = jwtService.extractUsername(token);
        assertEquals("developer@devhub.com", extractedUsername);
    }

    @Test
    void isTokenValid_ValidToken_ReturnsTrue() {
        UserDetails userDetails = new User("developer@devhub.com", "password", Collections.emptyList());

        String token = jwtService.generateToken(userDetails);
        boolean isValid = jwtService.isTokenValid(token, userDetails);

        assertTrue(isValid);
    }

    @Test
    void isTokenValid_DifferentUser_ReturnsFalse() {
        UserDetails userDetails1 = new User("user1@devhub.com", "password", Collections.emptyList());
        UserDetails userDetails2 = new User("user2@devhub.com", "password", Collections.emptyList());

        String token = jwtService.generateToken(userDetails1);
        boolean isValid = jwtService.isTokenValid(token, userDetails2);

        assertFalse(isValid);
    }
}
