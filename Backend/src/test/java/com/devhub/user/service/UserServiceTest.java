package com.devhub.user.service;

import com.devhub.common.exception.DuplicateResourceException;
import com.devhub.common.exception.ResourceNotFoundException;
import com.devhub.queue.event.UserRegisteredEvent;
import com.devhub.queue.publisher.EventPublisher;
import com.devhub.user.dto.CreateUserRequest;
import com.devhub.user.dto.UpdateUserRequest;
import com.devhub.user.dto.UserResponse;
import com.devhub.user.entity.User;
import com.devhub.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EventPublisher eventPublisher;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User sampleUser;

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
    }

    @Test
    void createUser_Success() {
        CreateUserRequest request = new CreateUserRequest("Alex Johnson", "alex@example.com", "secret123");

        when(userRepository.existsByEmail("alex@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        UserResponse response = userService.createUser(request);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("Alex Johnson", response.name());
        assertEquals("alex@example.com", response.email());
        assertEquals(User.Role.USER, response.role());

        verify(eventPublisher, times(1)).publish(any(UserRegisteredEvent.class));
    }

    @Test
    void createUser_DuplicateEmail_ThrowsException() {
        CreateUserRequest request = new CreateUserRequest("Alex Johnson", "alex@example.com", "secret123");

        when(userRepository.existsByEmail("alex@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> userService.createUser(request));
        verify(userRepository, never()).save(any(User.class));
        verify(eventPublisher, never()).publish(any(UserRegisteredEvent.class));
    }

    @Test
    void getUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        UserResponse response = userService.getUserById(1L);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("alex@example.com", response.email());
    }

    @Test
    void getUserById_NotFound_ThrowsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(99L));
    }

    @Test
    void getAllUsers_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<User> userPage = new PageImpl<>(List.of(sampleUser));
        when(userRepository.findAll(pageable)).thenReturn(userPage);

        Page<UserResponse> result = userService.getAllUsers(pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals("Alex Johnson", result.getContent().get(0).name());
    }

    @Test
    void updateUser_Success() {
        UpdateUserRequest request = new UpdateUserRequest("Alex Updated", "alex.updated@example.com");

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userRepository.existsByEmailAndIdNot("alex.updated@example.com", 1L)).thenReturn(false);

        UserResponse response = userService.updateUser(1L, request);

        assertEquals("Alex Updated", response.name());
        assertEquals("alex.updated@example.com", response.email());
    }

    @Test
    void deleteUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        userService.deleteUser(1L);

        verify(userRepository, times(1)).delete(sampleUser);
    }
}
