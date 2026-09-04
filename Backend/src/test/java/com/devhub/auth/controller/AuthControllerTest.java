package com.devhub.auth.controller;

import com.devhub.auth.dto.AuthResponse;
import com.devhub.auth.dto.LoginRequest;
import com.devhub.auth.service.AuthService;
import com.devhub.user.dto.CreateUserRequest;
import com.devhub.user.dto.UserResponse;
import com.devhub.user.entity.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void register_Success() throws Exception {
        CreateUserRequest request = new CreateUserRequest("Jane Doe", "jane@devhub.com", "password123");
        AuthResponse response = new AuthResponse("mock.jwt.token", 1L, "Jane Doe", "jane@devhub.com", User.Role.USER);

        when(authService.register(any(CreateUserRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("mock.jwt.token"))
                .andExpect(jsonPath("$.data.email").value("jane@devhub.com"));
    }

    @Test
    void login_Success() throws Exception {
        LoginRequest request = new LoginRequest("jane@devhub.com", "password123");
        AuthResponse response = new AuthResponse("mock.jwt.token", 1L, "Jane Doe", "jane@devhub.com", User.Role.USER);

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("mock.jwt.token"));
    }

    @Test
    void getCurrentUser_Success() throws Exception {
        UserResponse response = new UserResponse(1L, "Jane Doe", "jane@devhub.com", User.Role.USER, LocalDateTime.now());
        Authentication auth = new UsernamePasswordAuthenticationToken("jane@devhub.com", "credentials");

        when(authService.getCurrentUser("jane@devhub.com")).thenReturn(response);

        mockMvc.perform(get("/api/v1/auth/me").principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Jane Doe"))
                .andExpect(jsonPath("$.data.email").value("jane@devhub.com"));
    }
}
