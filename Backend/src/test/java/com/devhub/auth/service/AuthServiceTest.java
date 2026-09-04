package com.devhub.auth.service;

import com.devhub.auth.dto.AuthResponse;
import com.devhub.auth.dto.LoginRequest;
import com.devhub.auth.security.CustomUserDetailsService;
import com.devhub.auth.security.JwtService;
import com.devhub.common.exception.DuplicateResourceException;
import com.devhub.common.exception.UnauthorizedException;
import com.devhub.queue.event.UserRegisteredEvent;
import com.devhub.queue.publisher.EventPublisher;
import com.devhub.user.dto.CreateUserRequest;
import com.devhub.user.entity.User;
import com.devhub.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private EventPublisher eventPublisher;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Alex Johnson")
                .email("alex@example.com")
                .password("encoded_pass")
                .role(User.Role.USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userDetails = new org.springframework.security.core.userdetails.User(
                "alex@example.com",
                "encoded_pass",
                Collections.emptyList()
        );
    }

    @Test
    void register_Success() {
        CreateUserRequest request = new CreateUserRequest("Alex Johnson", "alex@example.com", "secret123");

        when(userRepository.existsByEmail("alex@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(userDetailsService.loadUserByUsername("alex@example.com")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("mock.jwt.token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock.jwt.token", response.token());
        assertEquals("alex@example.com", response.email());
        verify(eventPublisher, times(1)).publish(any(UserRegisteredEvent.class));
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        CreateUserRequest request = new CreateUserRequest("Alex Johnson", "alex@example.com", "secret123");

        when(userRepository.existsByEmail("alex@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        LoginRequest request = new LoginRequest("alex@example.com", "secret123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken("alex@example.com", "secret123"));
        when(userRepository.findByEmail("alex@example.com")).thenReturn(Optional.of(sampleUser));
        when(userDetailsService.loadUserByUsername("alex@example.com")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("mock.jwt.token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock.jwt.token", response.token());
        assertEquals("Alex Johnson", response.name());
    }

    @Test
    void login_BadCredentials_ThrowsUnauthorizedException() {
        LoginRequest request = new LoginRequest("alex@example.com", "wrongpass");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }
}
