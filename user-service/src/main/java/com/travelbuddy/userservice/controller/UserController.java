package com.travelbuddy.userservice.controller;

import com.travelbuddy.userservice.dto.UserResponse;
import com.travelbuddy.userservice.dto.UserUpdateRequest;
import com.travelbuddy.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id,
                                                   @RequestBody UserUpdateRequest request,
                                                   Authentication auth) {
        Long authenticatedUserId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(userService.updateUser(id, authenticatedUserId, request));
    }
}
